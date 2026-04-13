import { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Вхід — CRM Глухомань',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — editorial cream */}
      <section className="hidden lg:flex lg:w-1/2 bg-[#faf6ec] text-[#0f1f18] flex-col justify-between p-16 relative overflow-hidden">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            Editorial CRM · MMXXVI
          </p>
        </div>

        <div className="max-w-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium mb-6">
            Вхід · CRM
          </p>
          <h1 className="font-display text-5xl xl:text-6xl text-[#1a3d2e] leading-[1.05]">
            Панель керування
            <br />
            <span className="italic text-[#1a3d2e]/80">«Глухомань»</span>
          </h1>
          <div className="mt-8 h-px w-24 bg-[#1a3d2e]/30" />
          <p className="mt-8 text-sm text-[#1a3d2e]/70 leading-relaxed max-w-sm">
            Приватний кабінет адміністрації рекреаційного комплексу.
            Замовлення, бронювання, меню та тарифи — в одному місці.
          </p>
        </div>

        <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/45 font-medium">
          Нижні Млини · Полтавщина
        </div>
      </section>

      {/* Right — dark forest form */}
      <section className="flex-1 bg-[#0f1f18] flex items-center justify-center p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/60 font-medium">
              Вхід · CRM
            </p>
            <h2 className="font-display text-3xl text-[#e6d9b8] mt-2">
              <span className="italic">Ласкаво просимо</span>
            </h2>
            <div className="mt-4 h-px w-16 bg-[#e6d9b8]/30" />
          </div>

          <LoginForm />

          <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-center text-[#e6d9b8]/40 font-medium">
            Доступ лише для адміністраторів
          </p>
        </div>
      </section>
    </main>
  );
}
