"use server";

import { z } from "zod";
import { actionClient } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { returnValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { isPast } from "date-fns";


const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date } }) => {
    if (isPast(date)) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já passaram."],
      });
    }
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    // Usuário está logado?
    if (!session?.user) {
      returnValidationErrors(inputSchema, {
        _errors: ["Não autorizado. Por favor, faça login para continuar."],
      });
    }
    const service = await prisma.barbershopService.findUnique({
      where: {
        id: serviceId,
      },
    });
    // Serviço existe?
    if (!service) {
      returnValidationErrors(inputSchema, {
        _errors: [
          "Serviço não encontrado. Por favor, selecione outro serviço.",
        ],
      });
    }
    // Já tem agendamento pra esse horário?
    const existingBooking = await prisma.booking.findFirst({
      where: {
        barbershopId: service.barbershopId,
        date,
        cancelledAt: null,
      },
    });

    if (existingBooking) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já estão agendadas."],
      });
    }
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date: date.toISOString(),
        userId: session.user.id,
        barbershopId: service.barbershopId,
      },
    });
    return booking;
  });