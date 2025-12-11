'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	caseFormSchema,
	type CaseFormData,
} from '@/lib/validations/case-schema'
import { DollarSign, Calendar, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react'

interface CaseCreationStepProps {
  debtorId: string;
  debtorName: string;
  onSubmit: (data: CaseFormData & { debtorId: string }) => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function CaseCreationStep({
  debtorId,
  debtorName,
  onSubmit,
  onBack,
  isSubmitting = false,
}: CaseCreationStepProps) {
  const [formData, setFormData] = useState<CaseFormData>({
    originalAmount: "1000.00",
    currentBalance: "1000.00",
    interestRate: "0.00",
    externalReference: "",
    dueDate: "",
    lastContactDate: "",
    nextActionDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = caseFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      setErrors(fieldErrors);
      return;
    }

    // Validate that currentBalance equals originalAmount
    if (
      Number(result.data.currentBalance) !== Number(result.data.originalAmount)
    ) {
      setErrors({
        currentBalance:
          "Current balance must equal original amount for new cases",
      });
      return;
    }

    try {
      await onSubmit({ ...result.data, debtorId });
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create case",
      });
    }
  };

  const updateField = (field: keyof CaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Sync currentBalance with originalAmount when originalAmount changes
  const handleOriginalAmountChange = (value: string) => {
    updateField("originalAmount", value);
    if (
      !formData.currentBalance ||
      formData.currentBalance === formData.originalAmount
    ) {
      updateField("currentBalance", value);
    }
  };

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<div>
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Case</h2>
				<p className="text-slate-600 dark:text-slate-400 mt-1">
					Enter case details for <strong className="text-blue-600 dark:text-blue-400">{debtorName}</strong>
				</p>
			</div>

			<Card className="border-2">
				<CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
						Financial Information
					</CardTitle>
					<CardDescription>
						Enter the debt amount and interest rate
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Original Amount ($)</label>
						<Input
							type="number"
							step="0.01"
							min="0"
							value={formData.originalAmount}
							onChange={(e) => handleOriginalAmountChange(e.target.value)}
							required
							aria-invalid={!!errors.originalAmount}
						/>
						{errors.originalAmount && (
							<p className="text-sm text-red-600 dark:text-red-400 mt-1">
								{errors.originalAmount}
							</p>
						)}
					</div>
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Balance ($)</label>
						<Input
							type="number"
							step="0.01"
							min="0"
							value={formData.currentBalance}
							onChange={(e) => updateField('currentBalance', e.target.value)}
							required
							aria-invalid={!!errors.currentBalance}
						/>
						{errors.currentBalance && (
							<p className="text-sm text-red-600 dark:text-red-400 mt-1">
								{errors.currentBalance}
							</p>
						)}
						<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
							For new cases, this should equal the original amount
						</p>
					</div>
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interest Rate (%)</label>
						<Input
							type="number"
							step="0.01"
							min="0"
							value={formData.interestRate || ''}
							onChange={(e) => updateField('interestRate', e.target.value)}
							aria-invalid={!!errors.interestRate}
						/>
						{errors.interestRate && (
							<p className="text-sm text-red-600 dark:text-red-400 mt-1">
								{errors.interestRate}
							</p>
						)}
					</div>
				</CardContent>
      </Card>

			<Card className="border-2">
				<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						Case Details
					</CardTitle>
					<CardDescription>
						Additional information about the case
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-slate-300">External Reference</label>
						<Input
							value={formData.externalReference || ''}
							onChange={(e) => updateField('externalReference', e.target.value)}
						/>
						<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
							Optional reference ID from your system
						</p>
					</div>
				</CardContent>
			</Card>

			<Card className="border-2">
				<CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
						Important Dates
					</CardTitle>
					<CardDescription>Key dates for this case</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
						<Input
							type="date"
							value={formData.dueDate || ''}
							onChange={(e) => updateField('dueDate', e.target.value)}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Contact Date</label>
						<Input
							type="date"
							value={formData.lastContactDate || ''}
							onChange={(e) => updateField('lastContactDate', e.target.value)}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Next Action Date</label>
						<Input
							type="date"
							value={formData.nextActionDate || ''}
							onChange={(e) => updateField('nextActionDate', e.target.value)}
						/>
					</div>
				</CardContent>
			</Card>

			{errors.submit && (
				<div className="rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
					{errors.submit}
				</div>
			)}

			<div className="flex gap-4 justify-end">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={isSubmitting}
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
				>
					{isSubmitting ? (
						'Creating Case...'
					) : (
						<>
							<CheckCircle2 className="h-4 w-4 mr-2" />
							Create Case
						</>
					)}
				</Button>
			</div>
		</form>
	)
}
