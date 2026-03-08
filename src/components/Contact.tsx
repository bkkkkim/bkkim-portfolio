import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FadeIn, Section } from './Layout';
import { Send, Loader2 } from 'lucide-react';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (e) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="bg-white">
      <div className="max-w-4xl mx-auto w-full">
        <FadeIn>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-12">03. Contact</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <FadeIn delay={0.2}>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight leading-tight">Let's build<br/>something<br/>solid.</h3>
          </FadeIn>

          <FadeIn delay={0.4}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Name</label>
                <input 
                  {...register('name', { required: true })}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 focus:border-black focus:outline-none transition-colors font-medium rounded-none"
                  placeholder="Your Name"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 font-bold">Name is required</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Email</label>
                <input 
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 focus:border-black focus:outline-none transition-colors font-medium rounded-none"
                  placeholder="your@email.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 font-bold">Valid email is required</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Message</label>
                <textarea 
                  {...register('message', { required: true })}
                  rows={4}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 focus:border-black focus:outline-none transition-colors font-medium resize-none rounded-none"
                  placeholder="Tell me about your project..."
                />
                {errors.message && <span className="text-red-500 text-xs mt-1 font-bold">Message is required</span>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-600 text-sm text-center">Message sent successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600 text-sm text-center">Failed to send message. Please try again.</p>
              )}
            </form>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
