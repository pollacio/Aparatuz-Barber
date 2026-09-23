import Image from 'next/image'
import { BotMessageSquare, MenuIcon } from 'lucide-react'
import { Button } from './ui/button'
import MenuSheet from './menu-sheet'
import Link from 'next/link'

export default function Header() {
    return (
        <header className='bg-background flex items-center justify-between px-5 py-6'>
            <Image src='./logo.svg' alt='Aparatus' width={91} height={24} />
            <div className="flex items-center gap-2">
                <Link href="/chat">
                <Button variant="outline" size="icon">
                    <BotMessageSquare className="size-5" />
                </Button>
                </Link>
                <MenuSheet />
            </div>
        </header>
    )
}
