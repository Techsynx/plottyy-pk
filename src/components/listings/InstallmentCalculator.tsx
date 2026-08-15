'use client';

import React, { useState } from 'react';
import { formatPKR, getPKRInWords } from '@/lib/constants';
import { Calculator, Calendar, DollarSign, PieChart, Sparkles } from 'lucide-react';

interface InstallmentCalculatorProps {
  totalPrice: number;
}

export function InstallmentCalculator({ totalPrice }: InstallmentCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [durationYears, setDurationYears] = useState<number>(3);

  const downPaymentAmount = Math.round((totalPrice * downPaymentPercent) / 100);
  const remainingAmount = totalPrice - downPaymentAmount;
  const totalMonths = durationYears * 12;
  const totalQuarters = durationYears * 4;
  
  const possessionPaymentPercent = 10;
  const possessionAmount = Math.round((totalPrice * possessionPaymentPercent) / 100);
  
  const installmentPool = Math.max(0, remainingAmount - possessionAmount);
  const quarterlyInstallment = Math.round(installmentPool / totalQuarters);
  const monthlyEquivalent = Math.round(installmentPool / totalMonths);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E8E3DC] shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F6B5C]/10 flex items-center justify-center text-[#0F6B5C]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1F2420]">Plot File & Installment Plan Schedule</h3>
            <p className="text-[11px] text-[#8A8D89]">Calculate quarterly payments for development schemes & files</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#0F6B5C] bg-[#E6F3F0] px-3 py-1 rounded-full">
          0% Interest Markup
        </span>
      </div>

      {/* Sliders / Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-[#1F2420] mb-2">
            <span>Down Payment Booking ({downPaymentPercent}%)</span>
            <span className="text-[#0F6B5C] font-extrabold">{formatPKR(downPaymentAmount)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full h-2 bg-[#E8E3DC] rounded-lg appearance-none cursor-pointer accent-[#0F6B5C]"
          />
          <div className="flex justify-between text-[10px] text-[#8A8D89] mt-1">
            <span>10% (Min)</span>
            <span>25% (Standard)</span>
            <span>50%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-bold text-[#1F2420] mb-2">
            <span>Payment Period ({durationYears} Years)</span>
            <span className="text-[#0F6B5C] font-extrabold">{totalQuarters} Quarters</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={durationYears}
            onChange={(e) => setDurationYears(Number(e.target.value))}
            className="w-full h-2 bg-[#E8E3DC] rounded-lg appearance-none cursor-pointer accent-[#0F6B5C]"
          />
          <div className="flex justify-between text-[10px] text-[#8A8D89] mt-1">
            <span>1 Year (Fast)</span>
            <span>3 Years</span>
            <span>5 Years</span>
          </div>
        </div>
      </div>

      {/* Plan Breakdown Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3DC] text-center">
        <div>
          <p className="text-[10px] font-bold text-[#8A8D89] uppercase">Down Payment</p>
          <p className="text-base font-black text-[#1F2420]">{formatPKR(downPaymentAmount)}</p>
          <p className="text-[10px] text-[#6B726D]">At Time of Booking</p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-[#8A8D89] uppercase">Quarterly Installment</p>
          <p className="text-base font-black text-[#0F6B5C]">{formatPKR(quarterlyInstallment)}</p>
          <p className="text-[10px] text-[#6B726D]">Every 3 Months</p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-[#8A8D89] uppercase">Monthly Equivalent</p>
          <p className="text-base font-black text-[#1F2420]">{formatPKR(monthlyEquivalent)}</p>
          <p className="text-[10px] text-[#6B726D]">Estimated Monthly</p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-[#8A8D89] uppercase">On Possession (10%)</p>
          <p className="text-base font-black text-[#D97B4F]">{formatPKR(possessionAmount)}</p>
          <p className="text-[10px] text-[#6B726D]">At Balloting / Keys</p>
        </div>
      </div>

      <p className="text-[10px] text-[#8A8D89] text-center">
        * Installment structure is indicative based on standard Pakistani society schedules (DHA, Bahria, Gulberg). Contact listing dealer for official allotment schedule.
      </p>

    </div>
  );
}
