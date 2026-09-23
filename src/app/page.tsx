import Header from "@/components/header";
import { PageContainer, PageSectionContent, PageSectionScroller, PageSectionTitle } from "@/components/ui/page";
import Image from "next/image";
import banner from '../../public/banner.png'
import BookingItem from "@/components/booking-item";
import { getBarbershops, getPopularBarbershops } from "@/data/barbersshops";
import BarbershopItem from "@/components/barbershop-item";
import QuickSearch from "@/components/quick-search";
import { getUserBookings } from "@/data/bookings";

export default async function Home() {

  const barbershops = await getBarbershops();
  const popularBarbershops = await getPopularBarbershops();
  const { confirmedBookings } = await getUserBookings();

  console.log('confirmedBookings >>> ', confirmedBookings)

  return (

    <div>
      <Header />
      <PageContainer>
        <QuickSearch />
        <Image 
          src={banner}
          alt="Agende nos melhores com Aparatus"
          sizes="100vw"
          className="h-auto w-full"
        />


        {confirmedBookings.length > 0 && (
          <PageSectionContent>
            <PageSectionTitle>Agendamentos</PageSectionTitle>
            {confirmedBookings.map((booking) => (
              <BookingItem booking={booking} key={booking.id} />
            ))}
            
          </PageSectionContent>
        )}


        <PageSectionContent>
          <PageSectionTitle>Barbearias</PageSectionTitle>
          <PageSectionScroller>
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSectionContent>

        <PageSectionContent>
          <PageSectionTitle>
            Barbearias populares
          </PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSectionContent>

      </PageContainer>
    </div>

  );
}
