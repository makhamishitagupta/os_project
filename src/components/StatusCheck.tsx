import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { Search, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusForm {
  plateNumber: string;
}

export default function StatusCheck() {
  const { register, handleSubmit, formState: { errors } } = useForm<StatusForm>();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null); // ✅ FIXED
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: StatusForm) => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus(null); // ✅ FIXED

      const { data, error: fetchError } = await supabase
        .from('vehicles')
        .select('plate_number, status, created_at')
        .eq('plate_number', formData.plateNumber.toUpperCase())
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('No vehicle found with this plate number.');
        }
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error('Vehicle not found.');
      }

      // ✅ SET STATUS ONLY
      setStatus(data.status);

    } catch (err: any) {
      setError(err.message || 'Error checking status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'approved':
        return <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />;
      case 'rejected':
        return <XCircle className="w-12 h-12 text-red-500 mb-2" />;
      default:
        return <Clock className="w-12 h-12 text-yellow-500 mb-2" />;
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white shadow-xl rounded-3xl mt-8">

      <div className="flex flex-col items-center mb-8">
        <Search className="w-8 h-8 text-gray-700 mb-2" />
        <h2 className="text-2xl font-bold">Check Status</h2>
        <p className="text-sm text-gray-500">Enter your vehicle plate number</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          {...register('plateNumber', { required: 'Plate number is required' })}
          className="w-full px-4 py-3 border rounded-xl text-center uppercase font-bold"
          placeholder="ABC 1234"
        />

        {errors.plateNumber && (
          <p className="text-red-500 text-sm text-center">
            {errors.plateNumber.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gray-900 text-white rounded-xl"
        >
          {isLoading ? "Checking..." : "Check Status"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-600 rounded-xl text-center">
          {error}
        </div>
      )}

      {status && (
        <div className="mt-8 flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
          {getStatusIcon(status)}
          <span className="text-sm text-gray-500 mb-2">Registration Status</span>

          <span className={`px-4 py-2 rounded-full font-bold ${getStatusColor(status)}`}>
            {status.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}