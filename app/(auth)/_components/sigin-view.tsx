import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import ContentCarouselAuth from './content-carousel';

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <ContentCarouselAuth />
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Masuk</h1>
            <p className="text-sm text-muted-foreground">
              Masukan email dan kata sandi Anda untuk mengkases kembali akun
              Anda.
            </p>
          </div>
          <UserAuthForm />
          <p className="text-center">
            Belum punya akun?{' '}
            <Link href="/auth/sign-up" className="text-primary">
              Daftar Sekarang
            </Link>
          </p>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
