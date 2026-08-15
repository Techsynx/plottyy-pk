'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { 
  Phone, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Building2,
  Lock
} from 'lucide-react';
import { formatPKR } from '@/lib/constants';
import { recordLead } from '@/lib/actions/leads';

interface ContactSidebarProps {
  listing: Listing;
}

export function ContactSidebar({ listing }: ContactSidebarProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In-app form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    `Assalam o Alaikum, I am interested in "${listing.title}". Please share further details.`
  );

  const handleRevealPhone = async () => {
    setShowPhone(true);
    await recordLead({
      listingId: listing.id,
      leadType: 'phone_reveal',
    });
  };

  const handleWhatsAppClick = async () => {
    await recordLead({
      listingId: listing.id,
      leadType: 'whatsapp_click',
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;

    setIsSubmitting(true);
    await recordLead({
      listingId: listing.id,
      leadType: 'contact_form',
      buyerName: name || 'Inquiring Buyer',
      buyerPhone: phone,
      buyerEmail: email,
      message,
    });
    setIsSubmitting(false);
    setFormSubmitted(true);
  };

  const cleanPhone = (listing.contact_whatsapp || listing.contact_phone).replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum, I am inquiring about your property on plottyy:\n\n*${listing.title}*\nPrice: ${formatPKR(listing.price)}\nLocation: ${listing.location?.name}, ${listing.city?.name}\n\nIs this property still available for visit/transfer?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] property-card-shadow space-y-6 sticky top-20">
      
      {/* Price Summary */}
      <div className="pb-4 border-b border-[#E8E3DC]">
        <span className="text-xs text-[#8A8D89] font-bold uppercase tracking-wider">
          Asking Price
        </span>
        <div className="text-3xl font-extrabold text-[#0F6B5C] tracking-tight mt-1">
          {formatPKR(listing.price, listing.purpose === 'rent')}
        </div>
        <div className="text-xs text-[#6B726D] font-medium mt-1">
          {listing.is_price_negotiable ? 'Negotiable for serious cash buyers' : 'Fixed Price'}
        </div>
      </div>

      {/* Lister Profile Card */}
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3DC] space-y-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#E6F3F0] text-[#0F6B5C] flex-shrink-0 flex items-center justify-center font-bold text-lg border border-[#E8E3DC]">
            {listing.user?.avatar_url ? (
              <img src={listing.user.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              listing.user?.full_name?.charAt(0) || 'L'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm text-[#1F2420] truncate">
                {listing.user?.full_name || 'Verified Lister'}
              </span>
              {listing.user?.is_verified && (
                <ShieldCheck className="w-4 h-4 text-[#0F6B5C] flex-shrink-0" />
              )}
            </div>
            <p className="text-xs font-semibold text-[#0F6B5C] truncate">
              {listing.user?.agency_name || 'Direct Property Owner'}
            </p>
            {listing.user?.rating && (
              <p className="text-[11px] text-[#6B726D] flex items-center space-x-1 mt-0.5">
                <span className="text-amber-500 font-bold">★ {listing.user.rating}</span>
                <span>• {listing.user.experience_years || 5}+ yrs in market</span>
              </p>
            )}
          </div>
        </div>

        {listing.user_id && (
          <Link
            href={`/agents/${listing.user?.username || listing.user_id}`}
            className="block text-center text-xs font-bold text-[#0F6B5C] hover:underline bg-white border border-[#0F6B5C]/20 py-2 rounded-xl"
          >
            View Agency Profile & All Properties →
          </Link>
        )}
      </div>

      {/* Primary Contact Action Buttons */}
      <div className="space-y-2.5">
        
        {/* Phone Reveal Button */}
        {showPhone ? (
          <a
            href={`tel:${listing.contact_phone}`}
            className="w-full bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all text-center"
          >
            <Phone className="w-4 h-4" />
            <span>Call {listing.contact_phone}</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={handleRevealPhone}
            className="w-full bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Show Phone Number</span>
          </button>
        )}

        {/* WhatsApp Deep-Link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="w-full bg-[#25D366] hover:bg-[#20b858] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>

      </div>

      {/* In-App Direct Message Form */}
      <div className="pt-4 border-t border-[#E8E3DC] space-y-3">
        <h4 className="text-xs font-bold text-[#1F2420] uppercase tracking-wider">
          Send Direct Inquiry
        </h4>

        {formSubmitted ? (
          <div className="bg-[#EFF6EE] border border-[#7FA37A]/30 rounded-xl p-4 text-center space-y-1.5">
            <CheckCircle2 className="w-6 h-6 text-[#7FA37A] mx-auto" />
            <p className="text-xs font-bold text-[#1F2420]">Inquiry Sent Successfully!</p>
            <p className="text-[11px] text-[#6B726D]">
              The lister has received your message and will contact you via WhatsApp/Phone shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-2.5">
            <div>
              <input
                type="text"
                required
                placeholder="Your Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-lg px-3 py-2 text-xs text-[#1F2420] focus:outline-none"
              />
            </div>
            <div>
              <input
                type="tel"
                required
                placeholder="Your Phone / WhatsApp Number * (e.g. 03001234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-lg px-3 py-2 text-xs text-[#1F2420] focus:outline-none"
              />
            </div>
            <div>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-lg px-3 py-2 text-xs text-[#1F2420] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D97B4F] hover:bg-[#c4683c] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Message to Lister'}</span>
            </button>
          </form>
        )}

      </div>

      <div className="flex items-center justify-center space-x-1 text-[11px] text-[#8A8D89]">
        <Lock className="w-3 h-3" />
        <span>Your contact info is safe & shared only with this lister</span>
      </div>

    </div>
  );
}
