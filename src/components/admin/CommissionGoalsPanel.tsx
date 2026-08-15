import React, { useState } from 'react';
import { TrendingUp, Target, Edit3, Check, X, Award } from 'lucide-react';
import { CommissionRecord, CommissionSummary } from '../../types';

interface CommissionGoalsPanelProps {
  summary: CommissionSummary;
  records: CommissionRecord[];
  onSaveGoals: (goals: { weekly: number; monthly: number; annual: number }) => Promise<void>;
  onUpdateCommission: (
    id: string,
    updates: { commissionAmount?: number; notes?: string }
  ) => Promise<void>;
}

function formatETB(val: number): string {
  return `ETB ${Math.round(val).toLocaleString('en-US')}`;
}

const GoalCard: React.FC<{
  title: string;
  target: number;
  earned: number;
  remaining: number;
  progressPercent: number;
  editing: boolean;
  editValue: string;
  onEditStart: () => void;
  onEditChange: (v: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
}> = ({ title, target, earned, remaining, progressPercent, editing, editValue, onEditStart, onEditChange, onEditSave, onEditCancel }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">{title}</span>
      {editing ? (
        <div className="flex items-center gap-1.5">
          <button onClick={onEditSave} className="text-emerald-500 hover:text-emerald-400" title="Save">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={onEditCancel} className="text-neutral-500 hover:text-white" title="Cancel">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button onClick={onEditStart} className="text-neutral-500 hover:text-white" title="Edit target">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>

    <div>
      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Target</span>
      {editing ? (
        <input
          type="number"
          min={0}
          autoFocus
          value={editValue}
          onChange={e => onEditChange(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2 text-sm mt-1 focus:outline-none focus:border-red-600"
        />
      ) : (
        <span className="text-lg font-bold text-white">{formatETB(target)}</span>
      )}
    </div>

    <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-500"
        style={{ width: `${progressPercent}%` }}
      />
    </div>

    <div className="flex items-center justify-between text-xs">
      <span className="text-neutral-400">
        Earned <span className="text-white font-bold">{formatETB(earned)}</span>
      </span>
      <span className="text-red-500 font-bold">{progressPercent}%</span>
    </div>
    <p className="text-[11px] text-neutral-500">Remaining: {formatETB(remaining)}</p>
  </div>
);

export const CommissionGoalsPanel: React.FC<CommissionGoalsPanelProps> = ({
  summary,
  records,
  onSaveGoals,
  onUpdateCommission
}) => {
  const [editingGoal, setEditingGoal] = useState<'weekly' | 'monthly' | 'annual' | null>(null);
  const [goalDraft, setGoalDraft] = useState('');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recordDraft, setRecordDraft] = useState('');

  const startEditGoal = (key: 'weekly' | 'monthly' | 'annual', current: number) => {
    setEditingGoal(key);
    setGoalDraft(String(current));
  };

  const saveGoal = async () => {
    if (!editingGoal) return;
    const value = Number(goalDraft) || 0;
    await onSaveGoals({
      weekly: editingGoal === 'weekly' ? value : summary.goals.weekly.target,
      monthly: editingGoal === 'monthly' ? value : summary.goals.monthly.target,
      annual: editingGoal === 'annual' ? value : summary.goals.annual.target
    });
    setEditingGoal(null);
  };

  const startEditRecord = (record: CommissionRecord) => {
    setEditingRecordId(record.id);
    setRecordDraft(String(record.commissionAmount));
  };

  const saveRecord = async (id: string) => {
    await onUpdateCommission(id, { commissionAmount: Number(recordDraft) || 0 });
    setEditingRecordId(null);
  };

  return (
    <div className="space-y-8" id="admin-commission-goals-panel">
      <div className="border-b border-neutral-800 pb-6">
        <span className="text-red-500 text-xs font-bold uppercase tracking-widest block">
          PRIVATE — ADMIN ONLY
        </span>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight font-sans flex items-center gap-2">
          <Award className="w-7 h-7 text-red-600" />
          COMMISSION & SALES GOALS
        </h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Cars Sold (Week)', value: summary.carsSoldThisWeek },
          { label: 'Cars Sold (Month)', value: summary.carsSoldThisMonth },
          { label: 'Cars Sold (Year)', value: summary.carsSoldThisYear },
          { label: 'Total Commission Earned', value: formatETB(summary.totalCommissionEarned) }
        ].map(s => (
          <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">{s.label}</span>
            <span className="text-xl font-black text-white">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Commission This Week', value: summary.commissionThisWeek },
          { label: 'Commission This Month', value: summary.commissionThisMonth },
          { label: 'Commission This Year', value: summary.commissionThisYear }
        ].map(s => (
          <div key={s.label} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">{s.label}</span>
            <span className="text-lg font-bold text-emerald-400">{formatETB(s.value)}</span>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4">
          <Target className="w-4 h-4 text-red-600" />
          Goals & Motivation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GoalCard
            title="Weekly Goal"
            target={summary.goals.weekly.target}
            earned={summary.goals.weekly.earned}
            remaining={summary.goals.weekly.remaining}
            progressPercent={summary.goals.weekly.progressPercent}
            editing={editingGoal === 'weekly'}
            editValue={goalDraft}
            onEditStart={() => startEditGoal('weekly', summary.goals.weekly.target)}
            onEditChange={setGoalDraft}
            onEditSave={saveGoal}
            onEditCancel={() => setEditingGoal(null)}
          />
          <GoalCard
            title="Monthly Goal"
            target={summary.goals.monthly.target}
            earned={summary.goals.monthly.earned}
            remaining={summary.goals.monthly.remaining}
            progressPercent={summary.goals.monthly.progressPercent}
            editing={editingGoal === 'monthly'}
            editValue={goalDraft}
            onEditStart={() => startEditGoal('monthly', summary.goals.monthly.target)}
            onEditChange={setGoalDraft}
            onEditSave={saveGoal}
            onEditCancel={() => setEditingGoal(null)}
          />
          <GoalCard
            title="Annual Goal"
            target={summary.goals.annual.target}
            earned={summary.goals.annual.earned}
            remaining={summary.goals.annual.remaining}
            progressPercent={summary.goals.annual.progressPercent}
            editing={editingGoal === 'annual'}
            editValue={goalDraft}
            onEditStart={() => startEditGoal('annual', summary.goals.annual.target)}
            onEditChange={setGoalDraft}
            onEditSave={saveGoal}
            onEditCancel={() => setEditingGoal(null)}
          />
        </div>
      </div>

      {/* Commission records */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4">
          <TrendingUp className="w-4 h-4 text-red-600" />
          Commission Records ({records.length})
        </h2>

        {records.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-400 space-y-1">
            <p className="text-sm font-bold uppercase text-white">No commissions yet</p>
            <p className="text-xs">Mark a vehicle as Sold in Vehicles Inventory to generate a commission record automatically.</p>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-950 text-neutral-500 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3">Vehicle</th>
                  <th className="text-left px-4 py-3">Sale Price</th>
                  <th className="text-left px-4 py-3">Rate</th>
                  <th className="text-left px-4 py-3">Commission</th>
                  <th className="text-left px-4 py-3">Sold On</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {records.map(r => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-white font-semibold">
                      {r.vehicleName}
                      {r.isManualOverride && (
                        <span className="ml-2 text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase">Edited</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">{formatETB(r.salePrice)}</td>
                    <td className="px-4 py-3 text-neutral-400">{(r.commissionRate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      {editingRecordId === r.id ? (
                        <input
                          type="number"
                          autoFocus
                          value={recordDraft}
                          onChange={e => setRecordDraft(e.target.value)}
                          className="w-28 bg-neutral-950 border border-neutral-800 text-white rounded-lg p-1.5 text-xs focus:outline-none focus:border-red-600"
                        />
                      ) : (
                        <span className="text-emerald-400 font-bold">{formatETB(r.commissionAmount)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{new Date(r.soldAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {editingRecordId === r.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => saveRecord(r.id)} className="text-emerald-500 hover:text-emerald-400">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingRecordId(null)} className="text-neutral-500 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEditRecord(r)} className="text-neutral-500 hover:text-white">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
