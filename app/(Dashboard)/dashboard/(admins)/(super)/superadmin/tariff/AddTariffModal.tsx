'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';

const expectedHeaders = [
  's/n',
  'service',
  'price'
];

interface AddTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTariffAdded: () => void;
}

function splitCSVLine(line: string) {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  values.push(current.trim());
  return values.map((value) => value.replace(/^"|"$/g, '').trim());
}

function validateCsvHeaders(headerLine: string) {
  const headers = splitCSVLine(headerLine).map((value) => value.trim());
  if (headers.length !== expectedHeaders.length) {
    return false;
  }
  for (let i = 0; i < expectedHeaders.length; i += 1) {
    if (headers[i] !== expectedHeaders[i]) {
      return false;
    }
  }
  return true;
}

async function parseCsvFile(file: File) {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((row) => row.trim() !== '');

  if (lines.length < 2) {
    throw new Error('CSV file must contain a header row and at least one data row.');
  }

  const headerLine = lines[0];
  if (!validateCsvHeaders(headerLine)) {
    throw new Error(
      `CSV header must match exactly: ${expectedHeaders.join(', ')}. Ensure correct order and spelling.`
    );
  }

  const dataRows = lines.slice(1);
  const parsed = dataRows.map((line, rowIndex) => {
    const values = splitCSVLine(line);
    if (values.length !== expectedHeaders.length) {
      throw new Error(`Row ${rowIndex + 2} does not contain ${expectedHeaders.length} columns.`);
    }

    const record: Record<string, string> = {};
    expectedHeaders.forEach((header, index) => {
      record[header] = values[index] ?? '';
    });
    return record;
  });

  return parsed;
}

export default function AddTariffModal({ isOpen, onClose, onTariffAdded }: AddTariffModalProps) {
  const [providerName, setProviderName] = useState('');
  const [providerType, setProviderType] = useState('');
  const [agentName, setAgentName] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && !file.name.toLowerCase().endsWith('.csv')) {
      setErrors((prev) => ({ ...prev, csvFile: 'Please select a CSV file.' }));
      setCsvFile(null);
      return;
    }
    setCsvFile(file);
    setErrors((prev) => ({ ...prev, csvFile: '' }));
  };

  const validateFields = () => {
    const nextErrors: Record<string, string> = {};
    if (!providerName.trim()) nextErrors.providerName = 'Provider name is required.';
    if (!providerType.trim()) nextErrors.providerType = 'Provider type is required.';
    if (!agentName.trim()) nextErrors.agentName = 'Agent name is required.';
    if (!csvFile) nextErrors.csvFile = 'CSV file is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    if (!validateFields()) {
      return;
    }

    if (!csvFile) {
      setErrors({ csvFile: 'CSV file is required.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const tariffs = await parseCsvFile(csvFile);
      const response = await fetch('/api/admin/tariffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          providerName: providerName.trim(),
          providerType: providerType.trim(),
          agentName: agentName.trim(),
          tariffs,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Failed to upload tariffs.');
      }

      toast.success('Tariff uploaded successfully');
      setProviderName('');
      setProviderType('');
      setAgentName('');
      setCsvFile(null);
      onTariffAdded();
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, csvFile: err?.message || 'CSV validation failed.' }));
      toast.error(err?.message || 'CSV validation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full md:w-3xl h-full overflow-auto rounded-[15px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Add New Tariff</h2>
            <p className="text-sm text-slate-500">Provide provider details and upload a validated CSV file.</p>
          </div>
          <button type="button" onClick={onClose} className="">
            <FaTimes size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="providerName" className="block font-medium">
                Name of provider
              </label>
              <input
                id="providerName"
                type="text"
                value={providerName}
                onChange={(event) => setProviderName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              />
              {errors.providerName && <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>}
            </div>
            <div>
              <label htmlFor="providerType" className="block font-medium">
                Type
              </label>
              <input
                id="providerType"
                type="text"
                value={providerType}
                onChange={(event) => setProviderType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. optical, hospital, dental"
              />
              {errors.providerType && <p className="mt-1 text-sm text-red-600">{errors.providerType}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
            <label htmlFor="agentName" className="block font-medium">
              Agent name
            </label>
            <input
              id="agentName"
              type="text"
              value={agentName}
              onChange={(event) => setAgentName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
            />
            {errors.agentName && <p className="mt-1 text-sm text-red-600">{errors.agentName}</p>}
          </div>

          <div>
            <label htmlFor="csvFile" className="block font-medium">
              Upload CSV file
            </label>
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none"
            />
            {errors.csvFile && <p className="mt-1 text-sm text-red-600">{errors.csvFile}</p>}
            <p className="mt-2 text-xs text-slate-500">
              Required headers in order: {expectedHeaders.join(', ')}.
            </p>
          </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">CSV validation rules</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>File must be a CSV file.</li>
              <li>Empty rows are to be ignored.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 md:flex-row justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Tariff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
