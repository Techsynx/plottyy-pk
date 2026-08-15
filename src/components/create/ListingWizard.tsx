'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Home, 
  Building, 
  Sparkles, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Phone, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Star,
  CheckCircle2,
  Lock,
  RotateCcw,
  UploadCloud,
  Camera
} from 'lucide-react';
import { CITIES_DATA, LOCATIONS_DATA } from '@/lib/data/mock-db';
import { 
  PROPERTY_TYPES_CONFIG, 
  SIZE_UNITS_CONFIG, 
  AMENITY_TAGS, 
  formatPKR, 
  getPKRInWords, 
  convertToSqft 
} from '@/lib/constants';
import { PropertyPurpose, PropertyType, SizeUnit } from '@/types';
import { createListing } from '@/lib/actions/listings';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/actions/verification';

export function ListingWizard() {
  const router = useRouter();
  const { user } = useAuth();

  // Wizard Step State (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdListingSlug, setCreatedListingSlug] = useState<string | null>(null);

  // Auto-sync logged in agent details
  useEffect(() => {
    if (user) {
      setContactPhone(user.phone_number);
      setContactWhatsapp(user.phone_number);
      if (user.is_verified) {
        setOtpVerified(true);
      }
    }
  }, [user]);

  // Form State
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [propertyType, setPropertyType] = useState<PropertyType>('plot');
  const [subtype, setSubtype] = useState('residential_plot');

  // Step 2: Location
  const [cityId, setCityId] = useState<number>(1); // Default Lahore
  const [locationId, setLocationId] = useState<number>(102); // Default DHA Phase 6
  const [addressDetails, setAddressDetails] = useState('');

  // Step 3: Size & Specs
  const [size, setSize] = useState<number>(1);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('kanal');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [facing, setFacing] = useState('Main Boulevard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'possession_paid',
    'sui_gas',
    'electricity',
  ]);

  // Step 4: Pricing
  const [price, setPrice] = useState<number>(35000000); // 3.5 Crore default
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(true);
  const [installmentAvailable, setInstallmentAvailable] = useState(false);

  // Step 5: Photos
  const [photos, setPhotos] = useState<{ url: string; alt_text?: string; is_cover: boolean }[]>([
    {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      alt_text: 'Front plot elevation and boundary',
      is_cover: true,
    },
    {
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
      alt_text: 'Surrounding boulevard and road connectivity',
      is_cover: false,
    },
  ]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file uploads (FileReader to base64 data URLs)
  const handleLocalFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload image files only (JPEG, PNG, WebP).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage('Image file size should be under 15MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          setPhotos((prev) => [
            ...prev,
            {
              url: base64Url,
              alt_text: file.name.replace(/\.[^/.]+$/, ''),
              is_cover: prev.length === 0,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleLocalFiles(e.dataTransfer.files);
    }
  };

  // Step 6: Description & Contact
  const [title, setTitle] = useState('1 Kanal Direct Hot Location Plot in DHA Phase 6 Block MB');
  const [description, setDescription] = useState(
    'Prime location residential plot with 100% possession paid and all utility charges cleared. Direct road access, ready for immediate construction with clear title deeds.'
  );
  const [contactPhone, setContactPhone] = useState('+923008456123');
  const [contactWhatsapp, setContactWhatsapp] = useState('+923008456123');

  // OTP Verification State
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState('');

  // Derived filtered locations for current city
  const cityLocations = LOCATIONS_DATA.filter((l) => l.city_id === cityId);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleAddPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    setPhotos((prev) => [
      ...prev,
      {
        url: customPhotoUrl.trim(),
        alt_text: title,
        is_cover: prev.length === 0,
      },
    ]);
    setCustomPhotoUrl('');
  };

  const handleSetCover = (index: number) => {
    setPhotos((prev) =>
      prev.map((p, i) => ({
        ...p,
        is_cover: i === index,
      }))
    );
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((p) => p.is_cover)) {
        updated[0].is_cover = true;
      }
      return updated;
    });
  };

  // OTP Flow
  const handleRequestOtp = async () => {
    setOtpLoading(true);
    setErrorMessage('');
    const res = await sendPhoneOtp(contactPhone);
    setOtpLoading(false);
    if (res.success) {
      setOtpSent(true);
      if (res.debugCode) setDemoCodeHint(res.debugCode);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    const res = await verifyPhoneOtp(contactPhone, otpCode);
    setOtpLoading(false);
    if (res.verified) {
      setOtpVerified(true);
      setOtpModalOpen(false);
      // Auto submit listing
      await handleSubmitListing(false);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSubmitListing = async (isDraft = false) => {
    setIsSubmitting(true);
    setErrorMessage('');

    const inputData = {
      title,
      description,
      purpose,
      property_type: propertyType,
      subtype,
      city_id: cityId,
      location_id: locationId,
      address_details: addressDetails,
      size: Number(size),
      size_unit: sizeUnit,
      price: Number(price),
      is_price_negotiable: isPriceNegotiable,
      installment_available: installmentAvailable,
      bedrooms: bedrooms > 0 ? bedrooms : undefined,
      bathrooms: bathrooms > 0 ? bathrooms : undefined,
      facing,
      features: selectedFeatures,
      contact_phone: contactPhone,
      contact_whatsapp: contactWhatsapp || contactPhone,
      photos: photos.map((p) => ({
        url: p.url,
        alt_text: p.alt_text || title,
        is_cover: p.is_cover,
      })),
    };

    const res = await createListing(inputData, isDraft, user?.id);
    setIsSubmitting(false);

    if (res.success && res.slug) {
      if (res.listing) {
        try {
          const existing = localStorage.getItem('plottyy_user_listings');
          const list = existing ? JSON.parse(existing) : [];
          list.unshift(res.listing);
          localStorage.setItem('plottyy_user_listings', JSON.stringify(list));
        } catch (e) {}
      }
      router.push(`/listings/${res.slug}`);
    } else {
      setErrorMessage(res.error || 'Failed to create listing. Please check inputs.');
    }
  };

  const handleFinalSubmitClick = () => {
    if (!otpVerified) {
      setOtpModalOpen(true);
      handleRequestOtp();
    } else {
      handleSubmitListing(false);
    }
  };

  const steps = [
    { number: 1, label: 'Property Type' },
    { number: 2, label: 'Location' },
    { number: 3, label: 'Size & Specs' },
    { number: 4, label: 'Pricing' },
    { number: 5, label: 'Photos' },
    { number: 6, label: 'Publish' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Step Progress Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E3DC] property-card-shadow">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <div key={s.number} className="flex items-center space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.number)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-[#0F6B5C] text-white'
                      : isCurrent
                      ? 'bg-[#D97B4F] text-white ring-4 ring-[#D97B4F]/20'
                      : 'bg-[#F3EFEA] text-[#8A8D89] hover:bg-[#E6F3F0]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.number}
                </button>
                <span
                  onClick={() => setCurrentStep(s.number)}
                  className={`text-xs font-semibold hidden md:inline cursor-pointer ${
                    isCurrent ? 'text-[#1F2420]' : 'text-[#8A8D89] hover:text-[#1F2420]'
                  }`}
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <div className="w-6 sm:w-12 h-0.5 bg-[#E8E3DC] mx-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Property Type & Purpose */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3DC] property-card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-[#1F2420]">
              Step 1: Select Purpose & Property Category
            </h2>
            <p className="text-xs text-[#8A8D89] mt-1">
              Choose whether you are selling or renting, and specify the category.
            </p>
          </div>

          {/* Purpose Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Purpose
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setPurpose('sale')}
                className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  purpose === 'sale'
                    ? 'border-[#0F6B5C] bg-[#0F6B5C]/5 text-[#0F6B5C]'
                    : 'border-[#E8E3DC] text-[#6B726D] hover:bg-[#FAF8F5]'
                }`}
              >
                For Sale
              </button>
              <button
                type="button"
                onClick={() => setPurpose('rent')}
                className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  purpose === 'rent'
                    ? 'border-[#0F6B5C] bg-[#0F6B5C]/5 text-[#0F6B5C]'
                    : 'border-[#E8E3DC] text-[#6B726D] hover:bg-[#FAF8F5]'
                }`}
              >
                For Rent
              </button>
            </div>
          </div>

          {/* Property Types */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Property Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PROPERTY_TYPES_CONFIG.map((t) => {
                const isSelected = propertyType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setPropertyType(t.id);
                      setSubtype(t.subtypes[0].id);
                    }}
                    className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center space-y-2 ${
                      isSelected
                        ? 'border-[#0F6B5C] bg-[#0F6B5C]/5 text-[#0F6B5C] shadow-sm'
                        : 'border-[#E8E3DC] text-[#6B726D] hover:border-[#0F6B5C]/30 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="font-bold text-sm">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtypes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Specific Property Subtype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROPERTY_TYPES_CONFIG.find((t) => t.id === propertyType)?.subtypes.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSubtype(st.id)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                    subtype === st.id
                      ? 'border-[#0F6B5C] bg-[#0F6B5C] text-white shadow-xs'
                      : 'border-[#E8E3DC] text-[#1F2420] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>{st.label}</span>
                  {subtype === st.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Location */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3DC] property-card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-[#1F2420]">
              Step 2: Property Location & Society
            </h2>
            <p className="text-xs text-[#8A8D89] mt-1">
              Select the city and registered housing society/sector.
            </p>
          </div>

          {/* City Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              City *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CITIES_DATA.map((c) => {
                const isSelected = cityId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCityId(c.id);
                      const locs = LOCATIONS_DATA.filter((l) => l.city_id === c.id);
                      if (locs.length > 0) setLocationId(locs[0].id);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-[#0F6B5C] bg-[#0F6B5C] text-white shadow-xs'
                        : 'border-[#E8E3DC] text-[#1F2420] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Society / Area Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Housing Society / Phase / Sector *
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-sm font-semibold text-[#1F2420] focus:outline-none"
            >
              {cityLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.full_address_path}
                </option>
              ))}
            </select>
          </div>

          {/* Street / Plot Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Plot Number & Street Details (Optional / Hidden from public if preferred)
            </label>
            <input
              type="text"
              placeholder="e.g. Plot # 142, Block MB, Direct Main Boulevard..."
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-4 py-2.5 text-sm text-[#1F2420] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Size & Specifications */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3DC] property-card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-[#1F2420]">
              Step 3: Property Size & Specifics
            </h2>
            <p className="text-xs text-[#8A8D89] mt-1">
              Specify size in Marla, Kanal, or Sq. Yards. Equivalent Sq. Ft is calculated automatically.
            </p>
          </div>

          {/* Size & Unit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                Size / Area *
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={size}
                onChange={(e) => setSize(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-sm font-bold text-[#1F2420] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                Unit *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SIZE_UNITS_CONFIG.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSizeUnit(u.id)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      sizeUnit === u.id
                        ? 'border-[#0F6B5C] bg-[#0F6B5C] text-white shadow-xs'
                        : 'border-[#E8E3DC] text-[#1F2420] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-computed Equivalent banner */}
          <div className="bg-[#E6F3F0] border border-[#0F6B5C]/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-[#0F6B5C]">
            <span className="font-semibold">Equivalent Area:</span>
            <span className="font-extrabold text-sm">
              {convertToSqft(size, sizeUnit).toLocaleString()} Square Feet
            </span>
          </div>

          {/* Conditional Bedrooms/Bathrooms for Houses/Flats */}
          {(propertyType === 'house' || propertyType === 'flat') && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-sm font-bold text-[#1F2420] focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-sm font-bold text-[#1F2420] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Facing */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Facing & Orientation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Main Boulevard', 'Corner', 'Park Facing', 'North Facing', 'West Facing'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFacing(f)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    facing === f
                      ? 'border-[#0F6B5C] bg-[#0F6B5C] text-white shadow-xs'
                      : 'border-[#E8E3DC] text-[#1F2420] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities & Feature Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Features & Utilities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_TAGS.map((tag) => {
                const isSelected = selectedFeatures.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleFeature(tag.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-[#0F6B5C] bg-[#E6F3F0] text-[#0F6B5C] font-bold'
                        : 'border-[#E8E3DC] text-[#1F2420] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{tag.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0F6B5C]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Pricing */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3DC] property-card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-[#1F2420]">
              Step 4: Pricing (PKR)
            </h2>
            <p className="text-xs text-[#8A8D89] mt-1">
              Enter the total asking price. Words conversion in Lakh / Crore is previewed instantly.
            </p>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Total Price (in PKR) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                step="50000"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3.5 text-lg font-extrabold text-[#0F6B5C] focus:outline-none"
              />
            </div>
            
            {/* Live Words Preview */}
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E3DC] flex items-center justify-between text-xs">
              <span className="text-[#8A8D89] font-medium">In Words:</span>
              <span className="font-extrabold text-[#D97B4F] text-sm">
                {getPKRInWords(price) || 'Enter valid amount'}
              </span>
            </div>
          </div>

          {/* Quick Price Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#8A8D89] uppercase">Presets:</span>
            <div className="flex flex-wrap gap-2">
              {[5000000, 10000000, 25000000, 35000000, 50000000, 95000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPrice(preset)}
                  className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] rounded-md border border-[#E8E3DC] text-xs font-semibold transition-colors"
                >
                  {formatPKR(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPriceNegotiable}
                onChange={(e) => setIsPriceNegotiable(e.target.checked)}
                className="w-4 h-4 text-[#0F6B5C] rounded border-[#E8E3DC]"
              />
              <span className="text-xs font-bold text-[#1F2420]">
                Price is negotiable for serious buyers
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={installmentAvailable}
                onChange={(e) => setInstallmentAvailable(e.target.checked)}
                className="w-4 h-4 text-[#0F6B5C] rounded border-[#E8E3DC]"
              />
              <span className="text-xs font-bold text-[#1F2420]">
                Installment plan / Token advance options available
              </span>
            </label>
          </div>
        </div>
      )}

      {/* STEP 5: Photos */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3DC] property-card-shadow space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[#1F2420]">
                Step 5: Property Photos & Gallery
              </h2>
              <p className="text-xs text-[#8A8D89] mt-1">
                Upload photos from your computer/device. High quality photos attract 4x more buyer leads.
              </p>
            </div>
            <span className="text-xs font-bold bg-[#FAF8F5] border border-[#E8E3DC] px-3 py-1 rounded-lg text-[#0F6B5C] self-start sm:self-auto">
              {photos.length} of 20 Photos Added
            </span>
          </div>

          {/* Hidden File Input */}
          <input
            id="property-photo-upload"
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleLocalFiles(e.target.files)}
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
          />

          {/* Modern Drag & Drop Local Upload Zone */}
          <label
            htmlFor="property-photo-upload"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all block ${
              dragActive
                ? 'border-[#0F6B5C] bg-[#E6F3F0]/60 scale-[1.01]'
                : 'border-[#0F6B5C]/30 bg-[#FAF8F5] hover:bg-[#E6F3F0]/30 hover:border-[#0F6B5C]'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F3F0] text-[#0F6B5C] flex items-center justify-center shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-[#1F2420]">
                  Click to browse photos from your device
                </p>
                <p className="text-xs text-[#8A8D89]">
                  or drag and drop images directly here (JPEG, PNG, WebP up to 15MB each)
                </p>
              </div>
              <div className="bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all inline-flex items-center space-x-1.5 mt-2 pointer-events-none">
                <Camera className="w-4 h-4" />
                <span>Choose Photos from Local Storage</span>
              </div>
            </div>
          </label>

          {/* Secondary Option: Add via Web URL */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs font-semibold text-[#8A8D89] hover:text-[#0F6B5C] flex items-center space-x-1"
            >
              <span>{showUrlInput ? '− Hide web URL input' : '+ Or paste an image web URL'}</span>
            </button>

            {showUrlInput && (
              <div className="flex gap-2 mt-2">
                <input
                  type="url"
                  placeholder="Paste photo image URL (e.g. Unsplash or direct image link)..."
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-4 py-2 text-xs text-[#1F2420] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="bg-[#FAF8F5] hover:bg-[#E6F3F0] text-[#0F6B5C] border border-[#0F6B5C]/30 px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add URL</span>
                </button>
              </div>
            )}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((p, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 bg-[#F3EFEA] group ${
                  p.is_cover ? 'border-[#D97B4F]' : 'border-[#E8E3DC]'
                }`}
              >
                <img src={p.url} alt="" className="w-full h-full object-cover" />

                {p.is_cover && (
                  <span className="absolute top-2 left-2 bg-[#D97B4F] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    Cover Photo
                  </span>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {!p.is_cover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="bg-white text-[#1F2420] p-1.5 rounded-lg text-xs font-bold hover:bg-[#E6F3F0]"
                      title="Set as Cover Photo"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: Description & Contact */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3DC] property-card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-[#1F2420]">
              Step 6: Title, Description & Lister Details
            </h2>
            <p className="text-xs text-[#8A8D89] mt-1">
              Finalize title and phone number. A quick OTP confirmation will verify ownership before publishing.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-sm font-bold text-[#1F2420] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              Property Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-xs text-[#1F2420] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                Lister Phone Number (For Calls & OTP) *
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-sm font-bold text-[#1F2420] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                WhatsApp Number (For Direct Buyer Chats)
              </label>
              <input
                type="tel"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-sm font-bold text-[#1F2420] focus:outline-none"
              />
            </div>
          </div>

          {/* Verification Badge Notice */}
          <div className="bg-[#EFF6EE] border border-[#7FA37A]/30 rounded-xl p-4 flex items-center space-x-3 text-xs text-[#1F2420]">
            <ShieldCheck className="w-6 h-6 text-[#7FA37A] flex-shrink-0" />
            <div>
              <p className="font-bold">Spam & Fraud Deterrent: Phone Verification</p>
              <p className="text-[#6B726D] text-[11px]">
                Upon publishing, a 6-digit OTP ensures only verified owners and registered dealers can publish properties.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E8E3DC]">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-[#E8E3DC] bg-white text-[#1F2420] font-bold text-xs hover:bg-[#FAF8F5]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div></div>
        )}

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSubmitListing(true)}
            className="px-4 py-2.5 rounded-xl border border-[#E8E3DC] bg-white text-[#6B726D] font-bold text-xs hover:text-[#1F2420]"
          >
            Save as Draft
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center space-x-1.5 bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmitClick}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-[#D97B4F] hover:bg-[#c4683c] text-white px-8 py-3 rounded-xl font-extrabold text-sm shadow-lg transform active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Publishing...' : 'Verify & Publish Listing'}</span>
            </button>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-[#E8E3DC] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#EFF6EE] rounded-full flex items-center justify-center mx-auto text-[#0F6B5C]">
                <ShieldCheck className="w-6 h-6 text-[#7FA37A]" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2420]">Verify Phone Number</h3>
              <p className="text-xs text-[#6B726D]">
                We sent a 6-digit OTP code to <strong className="text-[#1F2420]">{contactPhone}</strong>.
              </p>
              {demoCodeHint && (
                <div className="bg-[#FAF8F5] border border-[#0F6B5C]/30 text-[#0F6B5C] p-2 rounded-lg text-xs font-mono font-bold">
                  Demo Test Code: {demoCodeHint} (or 123456)
                </div>
              )}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-widest text-2xl font-bold bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-[#1F2420] focus:outline-none"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading || otpCode.length < 6}
                className="w-full bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {otpLoading ? 'Verifying...' : 'Confirm & Go Live'}
              </button>

              <div className="flex items-center justify-between text-xs text-[#8A8D89] pt-2">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-[#0F6B5C] font-semibold hover:underline"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="text-[#6B726D] hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
