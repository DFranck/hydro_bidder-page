export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='max-w-[1440px] mx-auto text-3xl bg-[linear-gradient(180deg,#010006_49.9%,#001C47_100%)] pb-10'>
            {children}
        </div>
    );
}