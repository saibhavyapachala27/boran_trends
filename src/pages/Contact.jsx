import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, Instagram, Award, Star, Send } from 'lucide-react';

const STORES = [
  {
    name: 'Bhongir (Flagship Branch)',
    desc: 'Our flagship branch with the widest selection of premium menswear.',
    address: 'Near Railway Station Rd, Bhongir, Telangana 508116',
    phone: '+91 79891 63216',
    hours: '10:00 AM - 9:30 PM',
  },
  {
    name: 'Jangaon Store',
    desc: 'Curated luxury fashion in the heart of Jangaon.',
    address: 'Main Road Cross, Jangaon, Telangana 506167',
    phone: '+91 79891 63216',
    hours: '10:00 AM - 9:30 PM',
  },
  {
    name: 'Mothkur Store',
    desc: 'Premium menswear collection at our new Mothkur branch.',
    address: 'Main Rd, Near Bus Station, Mothkur, Telangana 508277',
    phone: '+91 79891 63216',
    hours: '10:00 AM - 9:30 PM',
  }
];

export default function Contact() {
  const { reviews, addReview } = useShop();
  
  // Feedback form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Please fill out your name and comment.');
      return;
    }
    addReview(name, rating, comment);
    setName('');
    setRating(5);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Reach Out</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Our Store Locations</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto font-light">
            Elevating your style with curated menswear across our exclusive branch boutiques. Feel free to visit us or shop online.
          </p>
        </div>

        {/* Info Grid: Locations & Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Branch Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground pb-2 border-b border-border/40">
              Select Branch Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STORES.map((store, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/25">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg text-foreground">{store.name}</h3>
                      <p className="text-xs text-muted-foreground font-light mt-1">{store.desc}</p>
                    </div>
                    <div className="space-y-2 pt-3 text-xs text-muted-foreground font-light border-t border-border/20">
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{store.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{store.hours} (Everyday)</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <a
                      href={`https://api.whatsapp.com/send/?phone=917989163216&text=Hello%20Boran%20Trends,%20I'm%20inquiring%20about%20the%20${encodeURIComponent(store.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/40 text-xs font-semibold transition-all"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-primary" /> Chat with Branch
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Direct Contact & Hours (4 cols) */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Store Hours Card */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground pb-2 border-b border-border/40">
                Business Hours
              </h2>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-light">
                  <h4 className="font-semibold text-foreground">Standard Hours</h4>
                  <p className="text-muted-foreground mt-0.5">Monday - Sunday</p>
                  <p className="text-foreground font-semibold mt-1">10:00 AM - 09:30 PM</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground pb-2 border-b border-border/40">
                Concierge Contact
              </h2>
              
              <div className="space-y-3">
                <a
                  href="https://api.whatsapp.com/send/?phone=917989163216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/30 bg-secondary/10 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">Order WhatsApp Support</h4>
                    <p className="text-[10px] text-muted-foreground font-light mt-0.5">+91 79891 63216</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/boran_trends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/30 bg-secondary/10 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">Official Instagram</h4>
                    <p className="text-[10px] text-muted-foreground font-light mt-0.5">@boran_trends</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-secondary/10">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">General Email</h4>
                    <p className="text-[10px] text-muted-foreground font-light mt-0.5">support@borantrends.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom note */}
            <p className="text-[10px] text-muted-foreground font-light leading-relaxed pt-2 border-t border-border/20">
              Visiting us in person is the best way to get bespoke alterations and fitting support. Our instore tailoring team is happy to adjust sizes upon request.
            </p>

          </div>

        </div>

        {/* Feedback / Customer Review form & lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border/40 pt-16">
          
          {/* Write feedback form (5 cols) */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Share Your Experience</h2>
              <p className="text-xs text-muted-foreground font-light">We would love to hear your feedback about our clothing and services.</p>
            </div>

            {submitted && (
              <div className="text-xs text-green-600 bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl font-medium">
                Thank you! Your feedback has been posted successfully.
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] px-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1.5">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-yellow-400 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${star <= rating ? 'fill-yellow-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Your Review / Comments *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-lg border border-border bg-[#F9FAFB] p-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md transition-colors"
              >
                <Send className="h-4 w-4" /> Submit Feedback
              </button>
            </form>
          </div>

          {/* Customer Reviews Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground pb-2 border-b border-border/40">
              Customer Testimonials & Reviews
            </h2>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {reviews.map((rev, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-border/60 rounded-xl p-5 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs sm:text-sm text-foreground">{rev.name}</h4>
                    <span className="text-[10px] text-muted-foreground font-light">
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stars display */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}`} />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
