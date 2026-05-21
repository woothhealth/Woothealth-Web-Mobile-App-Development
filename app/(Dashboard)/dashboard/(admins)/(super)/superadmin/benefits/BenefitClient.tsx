'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { IoMdCheckmarkCircleOutline, IoMdAdd, IoMdRemove } from 'react-icons/io';
import { toast } from 'sonner';
import {
  useAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  deleteAdminPlan,
  type AdminPlan,
} from '@/lib/adminPlans';
import {
  useAdminBenefits,
  createAdminBenefit,
  updateAdminBenefit,
  deleteAdminBenefit,
  type AdminBenefit,
} from '@/lib/adminBenefits';
import { FaTimes } from 'react-icons/fa';

type PlanWithBenefit = AdminPlan & {
  benefit?: AdminBenefit;
};

const BenefitClient = () => {
  const { data: plansRes, isLoading: isLoadingPlans, refetch: refetchPlans } = useAdminPlans();
  const { data: benefitsRes, isLoading: isLoadingBenefits, refetch: refetchBenefits } = useAdminBenefits();

  const plans: AdminPlan[] = Array.isArray(plansRes?.data)
    ? plansRes.data
    : Array.isArray(plansRes)
    ? plansRes
    : [];
  const benefits: AdminBenefit[] = Array.isArray(benefitsRes?.data)
    ? benefitsRes.data
    : Array.isArray(benefitsRes)
    ? benefitsRes
    : [];

  const mergedPlans: PlanWithBenefit[] = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        benefit: benefits.find((benefit) => benefit.plan_id === plan.$id || benefit.$id === plan.$id),
      })),
    [plans, benefits]
  );

  const [selectedPlan, setSelectedPlan] = useState<PlanWithBenefit | null>(null);
  const [editedPlan, setEditedPlan] = useState<Partial<PlanWithBenefit>>({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState<PlanWithBenefit | null>(null);
  const [createData, setCreateData] = useState({
    name: '',
    description: '',
    amount: '',
    planType: 'retail',
    category: '',
    plan_limit: '',
    benefits: [''],
    coverage: [''],
    coverage_limit: [''],
  });

  const statusColors: { [key: string]: string } = {
    active: 'bg-[#D1FAE5] text-[#10B981]',
    suspended: 'bg-[#FEE2E2] text-[#EF4444]',
  };

  useEffect(() => {
    if (selectedPlan) {
      setEditedPlan({
        $id: selectedPlan.$id,
        name: selectedPlan.name,
        description: selectedPlan.description,
        amount: selectedPlan.amount,
        planType: selectedPlan.planType,
        benefit: selectedPlan.benefit,
        benefits: selectedPlan.benefit?.benefits || [''],
        category: selectedPlan.benefit?.category || '',
        plan_limit: selectedPlan.benefit?.plan_limit || '',
        coverage: selectedPlan.benefit?.coverage || [''],
        coverage_limit: selectedPlan.benefit?.coverage_limit || [''],
      });
    }
  }, [selectedPlan]);

  const openEdit = (plan: PlanWithBenefit) => {
    setSelectedPlan(plan);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setSelectedPlan(null);
    setEditedPlan({});
    setIsEditOpen(false);
  };

  const handleEditedChange = (field: keyof Partial<PlanWithBenefit>, value: any) => {
    setEditedPlan((prev) => ({ ...prev, [field]: value }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const benefitsList = [...((editedPlan.benefits as string[]) || [])];
    benefitsList[index] = value;
    setEditedPlan((prev) => ({ ...prev, benefits: benefitsList }));
  };

  const handleRemoveBenefit = (index: number) => {
    const benefitsList = ((editedPlan.benefits as string[]) || []).filter((_benefit, i: number) => i !== index);
    setEditedPlan((prev) => ({ ...prev, benefits: benefitsList }));
  };

  const addBenefitField = () => {
    setEditedPlan((prev) => ({ ...prev, benefits: [...((prev.benefits as string[]) || []), ''] }));
  };

  const editedBenefitFields: string[] = (editedPlan.benefits as string[]) || [];

  const handleSaveEdit = async () => {
    if (!selectedPlan || !selectedPlan.$id) {
      toast.error('Cannot save empty plan');
      return;
    }

    const planPayload = {
      name: editedPlan.name || selectedPlan.name,
      description: editedPlan.description || selectedPlan.description,
      amount: Number(editedPlan.amount || selectedPlan.amount),
      planType: editedPlan.planType || selectedPlan.planType,
    };

    try {
      const planResult = await updateAdminPlan(selectedPlan.$id, planPayload);
      const updatedPlan = planResult?.data || planResult;

      if (editedPlan.benefits && selectedPlan.benefit?.$id) {
        const benefitPayload = {
          plan_id: selectedPlan.$id,
          plan_name: editedPlan.name || selectedPlan.name,
          category: editedPlan.category || selectedPlan.benefit?.category,
          source: selectedPlan.benefit?.source || 'Appwrite',
          plan_limit: editedPlan.plan_limit || selectedPlan.benefit?.plan_limit,
          benefits: editedPlan.benefits,
          coverage: editedPlan.coverage || selectedPlan.benefit?.coverage || [],
          coverage_limit: editedPlan.coverage_limit || selectedPlan.benefit?.coverage_limit || [],
        };
        await updateAdminBenefit(selectedPlan.benefit.$id, benefitPayload);
      }

      toast.success('Plan updated successfully');
      closeEdit();
      await Promise.all([refetchPlans(), refetchBenefits()]);
    } catch (error) {
      console.error('Save edit failed:', error);
      toast.error('Failed to update plan');
    }
  };

  const handleDelete = async (plan: PlanWithBenefit) => {
    if (!plan.$id) {
      toast.error('Missing plan id');
      return;
    }

    try {
      await deleteAdminPlan(plan.$id);
      if (plan.benefit?.$id) {
        await deleteAdminBenefit(plan.benefit.$id);
      }
      toast.success('Plan deleted successfully');
      await Promise.all([refetchPlans(), refetchBenefits()]);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete plan');
    }
  };

  const handleCreatePlan = async () => {
    try {
      const planPayload = {
        name: createData.name,
        description: createData.description,
        amount: Number(createData.amount),
        planType: createData.planType,
      };

      const planResult = await createAdminPlan(planPayload);
      const createdPlan = planResult?.data || planResult;

      await createAdminBenefit({
        plan_id: createdPlan.$id,
        plan_name: createdPlan.name,
        category: createData.category,
        source: 'Appwrite',
        plan_limit: createData.plan_limit,
        benefits: createData.benefits.filter(Boolean),
        coverage: createData.coverage.filter(Boolean),
        coverage_limit: createData.coverage_limit.filter(Boolean),
      });

      toast.success('Plan created successfully');
      setIsCreateOpen(false);
      await Promise.all([refetchPlans(), refetchBenefits()]);
    } catch (error) {
      console.error('Create plan failed:', error);
      toast.error('Failed to create plan');
    }
  };

  const planCards = mergedPlans.map((plan) => {
    const planBenefits = plan.benefit?.benefits?.filter(Boolean).slice(0, 6) || [];
    return (
      <div key={plan.$id} className='bg-[#FFFFFF] rounded-[10px] text-[#000000] shadow-lg h-150 pb-8'>
        <div className='w-76 md:w-full flex flex-col gap-4'>
          <div className='bg-[#49A5EFB2] rounded-t-[10px] text-[#FFFFFF] py-4 px-4 h-40 flex flex-col justify-between'>
            <h3 className='text-[24px] font-semibold mb-3'>{plan.name}</h3>
            <p className=' text-[#FFFFFF] text-start w-fit flex flex-col'>
              <span>For as low as</span>
              <span className='font-bold text-[20px]'>₦{Number(plan.amount).toLocaleString()}</span>
            </p>
          </div>
          <div className='px-4'>
            <p className='flex justify-between w-full'>
              <span>Plan type</span>
              <span className='text-lg capitalize font-semibold'>{plan.planType}</span>
            </p>
            <p className='flex justify-between w-full'>
              <span>Category</span>
              <span className='text-lg font-semibold capitalize'>{plan.benefit?.category || 'N/A'}</span>
            </p>
            <p className='flex justify-between'>
              <span>Plan limit</span>
              <span className='text-lg font-semibold'>{plan.benefit?.plan_limit || 'N/A'}</span>
            </p>
          </div>
          <div className='flex flex-col items-start px-4 gap-2'>
            <p className='text-lg font-semibold'>Benefits included:</p>
            <ul className='mb-4 text-left ml-2 text-sm h-34 overflow-y-auto w-full'>
              {planBenefits.length > 0 ? planBenefits.map((feature, index) => (
                <li key={index} className='mb-1 flex items-center gap-2'>
                  <IoMdCheckmarkCircleOutline className='text-[#10B981]' />
                  {feature}
                </li>
              )) : (
                <li className='text-sm text-slate-500'>No benefit details available</li>
              )}
            </ul>
            <div className='flex flex-col gap-2 w-full'>
              <button onClick={() => openEdit(plan)} className='bg-[#49A5EF] text-white flex justify-center py-3 rounded-[5px] w-full font-semibold'>
                Edit Benefits
              </button>
              <button onClick={() => setDeletingPlan(plan)} className='bg-[#EF4444] text-white flex justify-center py-3 rounded-[5px] w-full font-semibold'>
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  if (isLoadingPlans || isLoadingBenefits) {
    return <div className='py-8 text-center text-slate-600'>Loading plans and benefits...</div>;
  }

  return (
    <section className='py-4 md:p-4'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold'>Benefits & Plans</h2>
        <button
          onClick={() => setIsCreateOpen(true)}
          className='inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90'
        >
          <IoMdAdd size={18} /> Add Plan
        </button>
      </div>

      <div className='my-6 md:w-full mx-auto grid gap-8 md:grid-cols-3'>
        {planCards}
      </div>

      {isEditOpen && selectedPlan && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6'>
          <div className='w-full md:w-3xl h-[90svh] overflow-y-auto custom-scrollbar rounded-[15px] bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <h3 className='text-2xl font-semibold'>Edit Plan & Benefits</h3>
                <p className='text-sm text-slate-600'>Update plan data and remove benefits as needed.</p>
              </div>
              <button onClick={closeEdit} className='text-slate-600 hover:text-slate-900'>
                <FaTimes size={22} />
              </button>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <label className='block text-sm font-medium text-slate-700'>Plan Name</label>
                <input
                  value={editedPlan.name || ''}
                  onChange={(e) => handleEditedChange('name', e.target.value)}
                  className='w-full rounded-[10px] border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none'
                />

                <label className='block text-sm font-medium text-slate-700'>Description</label>
                <input
                  value={editedPlan.description || ''}
                  onChange={(e) => handleEditedChange('description', e.target.value)}
                  className='w-full rounded-[10px] border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none'
                />

                <label className='block text-sm font-medium text-slate-700'>Amount</label>
                <input
                  type='number'
                  value={editedPlan.amount || ''}
                  onChange={(e) => handleEditedChange('amount', Number(e.target.value))}
                  className='w-full rounded-[10px] border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none'
                />

                <label className='block text-sm font-medium text-slate-700'>Plan Type</label>
                <select
                  value={editedPlan.planType || ''}
                  onChange={(e) => handleEditedChange('planType', e.target.value)}
                  className='w-full rounded-[10px] border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none'
                >
                  <option value='retail'>Retail</option>
                  <option value='business'>Business</option>
                </select>
              </div>

              <div className='space-y-4'>
                <label className='block text-sm font-medium text-slate-700'>Category</label>
                <input
                  value={editedPlan.category || ''}
                  onChange={(e) => handleEditedChange('category', e.target.value)}
                  className='w-full rounded-[10px] border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none'
                />

                <label className='block text-sm font-medium text-slate-700'>Plan Limit</label>
                <input
                  value={editedPlan.plan_limit || ''}
                  onChange={(e) => handleEditedChange('plan_limit', e.target.value)}
                  className='w-full rounded-[10px] border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none'
                />

                <label className='block text-sm font-medium text-slate-700'>Source</label>
                <input
                  value={editedPlan.benefit?.source || 'Appwrite'}
                  disabled
                  className='w-full rounded-[10px] border border-border bg-slate-100 px-4 py-3 text-sm text-slate-500'
                />
              </div>
            </div>

            <div className='mt-6'>
              <h4 className='text-lg font-semibold'>Benefits</h4>
              {editedBenefitFields.map((benefit, index) => (
                <div key={index} className='mt-3 flex items-center gap-3'>
                  <input
                    type='text'
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    className='w-full rounded-[10px] border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none'
                  />
                  <button
                    onClick={() => handleRemoveBenefit(index)}
                    className='rounded-[10px] bg-red-100 px-4 py-3 text-sm text-red-600'
                  >
                    <IoMdRemove />
                  </button>
                </div>
              ))}
              <button
                onClick={addBenefitField}
                className='mt-4 inline-flex items-center gap-2 rounded-[10px] border border-slate-300 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100'
              >
                <IoMdAdd /> Add benefit field
              </button>
            </div>

            <div className='mt-8 flex flex-col gap-3 md:flex-row'>
              <button
                onClick={handleSaveEdit}
                className='w-full rounded-[10px] bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90'
              >
                Save Changes
              </button>
              <button
                onClick={closeEdit}
                className='w-full rounded-[10px] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6'>
            <div className='absolute inset-0 cursor-pointer' onClick={() => setIsCreateOpen(false)} />
          <div className='w-full md:w-3xl h-full z-20 overflow-y-auto rounded-[15px] bg-white p-6 shadow-xl custom-scrollbar'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-2xl font-semibold'>Create New Plan</h3>
              <button onClick={() => setIsCreateOpen(false)} className='text-slate-600 hover:text-slate-900'>
                <FaTimes size={22} />
              </button>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div>
                <label className='block font-medium text-slate-700'>Plan Name</label>
                <input
                  value={createData.name}
                  onChange={(e) => setCreateData((prev) => ({ ...prev, name: e.target.value }))}
                  className='w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none'
                />
                </div>

                <div>
                    <label className='block font-medium text-slate-700'>Description</label>
                <input
                  value={createData.description}
                  onChange={(e) => setCreateData((prev) => ({ ...prev, description: e.target.value }))}
                  className='w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none'
                />
                </div>

                <div>
                <label className='block font-medium text-slate-700'>Amount</label>
                <input
                  type='number'
                  value={createData.amount}
                  onChange={(e) => setCreateData((prev) => ({ ...prev, amount: e.target.value }))}
                  className='w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none'
                />
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                <label className='block font-medium text-slate-700'>Plan Type</label>
                <select
                  value={createData.planType}
                  onChange={(e) => setCreateData((prev) => ({ ...prev, planType: e.target.value }))}
                  className='w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none'
                >
                  <option value='retail'>Retail</option>
                  <option value='business'>Business</option>
                </select>
                </div>

                <div>
                  <label className='block font-medium text-slate-700'>Category</label>
                  <input
                    value={createData.category}
                    onChange={(e) => setCreateData((prev) => ({ ...prev, category: e.target.value }))}
                    className='w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                </div>

                <div>
                  <label className='block font-medium text-slate-700'>Plan Limit</label>
                  <input
                    value={createData.plan_limit}
                    onChange={(e) => setCreateData((prev) => ({ ...prev, plan_limit: e.target.value }))}
                    className='w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <h4 className='text-lg font-semibold'>Benefit items</h4>
              {createData.benefits.map((benefit, index) => (
                <div key={index} className='mt-3 flex items-center gap-3'>
                  <input
                    type='text'
                    value={benefit}
                    onChange={(e) => {
                      const items = [...createData.benefits];
                      items[index] = e.target.value;
                      setCreateData((prev) => ({ ...prev, benefits: items }));
                    }}
                    className='w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none'
                  />
                  <button
                    onClick={() => {
                      setCreateData((prev) => ({
                        ...prev,
                        benefits: prev.benefits.filter((_, i) => i !== index),
                      }));
                    }}
                    className='rounded-[10px] bg-red-100 px-4 py-3 text-sm text-red-600'
                  >
                    <IoMdRemove />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setCreateData((prev) => ({ ...prev, benefits: [...prev.benefits, ''] }))}
                className='mt-4 inline-flex items-center gap-2 rounded-[10px] border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100'
              >
                <IoMdAdd /> Add benefit item
              </button>
            </div>

            <div className='mt-8 flex flex-col gap-3 md:flex-row'>
              <button
                onClick={handleCreatePlan}
                className='w-full rounded-[10px] bg-primary px-4 py-3 font-semibold text-white hover:bg-primary/90'
              >
                Create Plan
              </button>
              <button
                onClick={() => setIsCreateOpen(false)}
                className='w-full rounded-[10px] border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingPlan && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6'>
          <div className='w-full max-w-md rounded-[10px] bg-white p-6 shadow-xl'>
            <h3 className='text-lg font-semibold'>Confirm Delete</h3>
            <p className='mt-2 text-sm text-slate-600'>
              Are you sure you want to delete the plan "{deletingPlan.name}"? This will also remove any associated benefit record and cannot be undone.
            </p>
            <div className='mt-6 flex gap-3'>
              <button
                onClick={async () => {
                  const planToDelete = deletingPlan;
                  setDeletingPlan(null);
                  if (planToDelete) {
                    await handleDelete(planToDelete);
                  }
                }}
                className='w-full rounded-[10px] bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700'
              >
                Yes, delete
              </button>
              <button
                onClick={() => setDeletingPlan(null)}
                className='w-full rounded-[10px] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BenefitClient;
