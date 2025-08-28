'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Phone, Mail, MessageCircle, Send, X } from 'lucide-react';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingForm({ isOpen, onClose }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    checkin: '',
    checkout: '',
    guests: '2',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Booking data:', formData);
    alert('Дякуємо за заявку! Ми зв\'яжемося з вами найближчим часом.');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-semibold mb-6">
            <Calendar className="h-5 w-5" />
            Швидке бронювання
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Забронювати зараз
            </span>
          </h2>
          
          <p className="text-muted-foreground">
            Заповніть форму і ми зв&apos;яжемося з вами протягом 15 хвилин
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="name">
                Ім&apos;я та прізвище *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                placeholder="Введіть ваше ім'я"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="phone">
                Телефон *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                placeholder="+380 XX XXX XX XX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email (опціонально)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              placeholder="your@email.com"
            />
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="service">
              Послуга *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            >
              <option value="">Оберіть послугу</option>
              <option value="hotel">Готель - Бронювання номера</option>
              <option value="restaurant">Ресторан - Бронювання столика</option>
              <option value="aquapark">Аквапарк - Квитки</option>
              <option value="banquet">Банкетна зала</option>
              <option value="sauna">Лазня/Сауна</option>
              <option value="other">Інше</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="checkin">
                Дата заїзду/відвідування *
              </label>
              <input
                type="date"
                id="checkin"
                name="checkin"
                value={formData.checkin}
                onChange={handleChange}
                required
                className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="checkout">
                Дата виїзду (для готелю)
              </label>
              <input
                type="date"
                id="checkout"
                name="checkout"
                value={formData.checkout}
                onChange={handleChange}
                className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="guests">
              Кількість осіб *
            </label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num.toString()}>{num} {num === 1 ? 'особа' : num < 5 ? 'особи' : 'осіб'}</option>
              ))}
              <option value="10+">Більше 10 осіб</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="message">
              Додаткові побажання
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-none"
              placeholder="Розкажіть про особливі побажання або запитання..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              type="submit"
              size="lg" 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="mr-2 h-5 w-5" />
              Відправити заявку
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              className="border-2 border-muted hover:bg-muted/50 rounded-xl py-4 text-lg font-semibold transition-all duration-300"
            >
              Скасувати
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center pt-6 border-t border-muted">
            <p className="text-sm text-muted-foreground mb-4">
              Або зв&apos;яжіться з нами напряму:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+380 XX XXX XX XX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@gluhoman.com.ua</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}