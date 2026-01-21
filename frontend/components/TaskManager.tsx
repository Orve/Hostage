"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchTasks,
  createTask,
  completeTask,
  deleteTask,
  Task,
  CreateTaskRequest
} from "../lib/api";

interface TaskManagerProps {
  userId: string;
  onTaskComplete: () => void; // ペットの状態を更新するためのコールバック
}

/**
 * TaskManager - タスク管理コンポーネント
 * 
 * タスクの作成、一覧表示、完了、削除を行う。
 * サイバーパンク・ホラーな雰囲気を維持。
 * 期限切れタスクは赤く禍々しく表示される。
 */
export default function TaskManager({ userId, onTaskComplete }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 新規タスク入力
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<CreateTaskRequest['priority']>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 完了時のエフェクト
  const [healMessage, setHealMessage] = useState<string | null>(null);

  // 期限切れ判定
  const isOverdue = (task: Task): boolean => {
    if (!task.due_date || task.completed) return false;
    return new Date(task.due_date) < new Date();
  };

  // 期限切れからの経過日数
  const getDaysOverdue = (task: Task): number => {
    if (!task.due_date) return 0;
    const now = new Date();
    const due = new Date(task.due_date);
    const diff = now.getTime() - due.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // 期限切れタスク数をカウント
  const overdueCount = tasks.filter(isOverdue).length;

  // タスク一覧を取得
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchTasks(userId, false); // 未完了のみ
      setTasks(response.tasks);
    } catch (e) {
      console.error("Failed to load tasks:", e);
      setError(e instanceof Error ? e.message : "TASK_LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId, loadTasks]);

  // タスク作成
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask({
        user_id: userId,
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
      });

      setNewTaskTitle("");
      setShowAddForm(false);
      await loadTasks();
    } catch (e) {
      console.error("Failed to create task:", e);
      setError(e instanceof Error ? e.message : "TASK_CREATE_FAILED");
    } finally {
      setIsSubmitting(false);
    }
  };

  // タスク完了（楽観的更新: UIを即座に更新、バックグラウンドでAPI呼び出し）
  const handleCompleteTask = async (taskId: string) => {
    // 完了対象のタスクを取得（ロールバック用）
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    // 楽観的更新: 即座にUIから削除
    setTasks(prev => prev.filter(t => t.id !== taskId));

    // 優先度に応じた予想回復量を即座に表示
    const expectedHeal = {
      low: 3,
      medium: 5,
      high: 8,
      critical: 12,
    }[targetTask.priority] || 5;

    setHealMessage(`+${expectedHeal} HP`);
    setTimeout(() => setHealMessage(null), 2000);

    // バックグラウンドでAPI呼び出し
    try {
      await completeTask(taskId);
      // 成功: ペットの状態を静かに更新
      onTaskComplete();
    } catch (e) {
      // 失敗: ロールバック（タスクを元に戻す）
      console.error("Failed to complete task:", e);
      setTasks(prev => [...prev, targetTask].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
      setHealMessage(null);
      setError(e instanceof Error ? e.message : "TASK_COMPLETE_FAILED");
    }
  };

  // タスク削除（楽観的更新）
  const handleDeleteTask = async (taskId: string) => {
    // 削除対象のタスクを取得（ロールバック用）
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    // 楽観的更新: 即座にUIから削除
    setTasks(prev => prev.filter(t => t.id !== taskId));

    // バックグラウンドでAPI呼び出し
    try {
      await deleteTask(taskId);
    } catch (e) {
      // 失敗: ロールバック
      console.error("Failed to delete task:", e);
      setTasks(prev => [...prev, targetTask].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
      setError(e instanceof Error ? e.message : "TASK_DELETE_FAILED");
    }
  };

  // 優先度に応じた色を返す（期限切れでない場合）
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 text-red-400';
      case 'high': return 'border-orange-500 text-orange-400';
      case 'medium': return 'border-cyan-500 text-cyan-400';
      case 'low': return 'border-gray-500 text-gray-400';
      default: return 'border-cyan-500 text-cyan-400';
    }
  };

  // 優先度ラベル
  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'MEDIUM';
    }
  };

  // タスクのスタイルクラスを取得（期限切れ考慮）
  const getTaskClasses = (task: Task) => {
    const overdue = isOverdue(task);

    if (overdue) {
      // 期限切れ: 禍々しい赤で表示
      return `
        border-red-600 text-red-400 
        bg-red-950/20 
        shadow-[0_0_20px_rgba(220,38,38,0.3)]
        animate-pulse
      `;
    }

    // 通常: 優先度に応じた色
    return `${getPriorityColor(task.priority)} bg-black/60 hover:bg-black/80`;
  };

  return (
    <div className="w-full mt-6">
      {/* ========== ヘッダー ========== */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-cyan-400 tracking-[0.2em] uppercase">
            ACTIVE_TASKS
          </h3>
          {/* 期限切れ警告バッジ */}
          {overdueCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-black tracking-wider animate-pulse"
            >
              {overdueCount} OVERDUE
            </motion.span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 text-xs border border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 tracking-wider uppercase"
        >
          {showAddForm ? "CANCEL" : "+ ADD_TASK"}
        </motion.button>
      </div>

      {/* ========== 回復メッセージ ========== */}
      <AnimatePresence>
        {healMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-emerald-900/90 border border-emerald-500 text-emerald-400 text-2xl font-bold tracking-widest"
          >
            {healMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== タスク追加フォーム ========== */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTask}
            className="mb-4 p-3 border border-cyan-900/50 bg-black/80 overflow-hidden"
          >
            <div className="space-y-3">
              {/* タイトル入力 */}
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="ENTER_TASK_DESIGNATION..."
                className="w-full px-3 py-2 bg-black border border-cyan-800 text-cyan-300 text-sm font-mono placeholder:text-cyan-900/50 focus:outline-none focus:border-cyan-400"
                disabled={isSubmitting}
                maxLength={200}
              />

              {/* 優先度選択 */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-600 tracking-widest">PRIORITY:</span>
                <div className="flex gap-1">
                  {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`px-2 py-1 text-[10px] tracking-wider uppercase border transition-colors ${newTaskPriority === p
                        ? getPriorityColor(p) + ' bg-opacity-20'
                        : 'border-gray-700 text-gray-600'
                        }`}
                    >
                      {getPriorityLabel(p)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 送信ボタン */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !newTaskTitle.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 border border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 text-xs tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "CREATING..." : "CREATE_TASK"}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ========== エラー表示 ========== */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-2 border border-red-900 bg-red-950/30 text-red-500 text-xs tracking-wider text-center font-mono"
        >
          ⚠ {error}
        </motion.div>
      )}

      {/* ========== タスク一覧 ========== */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-4">
            <span className="text-cyan-600 text-xs tracking-[0.3em] animate-pulse">
              LOADING_TASKS...
            </span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-cyan-900/30">
            <div className="text-cyan-800 text-xs tracking-widest">
              NO_ACTIVE_TASKS
            </div>
            <div className="text-cyan-900/50 text-[10px] mt-1 tracking-wider">
              ADD A TASK TO HEAL YOUR SUBJECT
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {tasks.map((task, index) => {
              const overdue = isOverdue(task);
              const daysOverdue = getDaysOverdue(task);

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative flex items-center gap-3 p-3 border transition-all ${getTaskClasses(task)}`}
                >
                  {/* 期限切れバッジ */}
                  {overdue && (
                    <div className="absolute top-0 right-0 bg-red-600 text-black text-[8px] font-bold px-2 py-0.5 tracking-wider">
                      ⚠ {daysOverdue}D OVERDUE
                    </div>
                  )}

                  {/* 完了ボタン */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCompleteTask(task.id)}
                    className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${overdue
                        ? 'border-red-500 hover:bg-red-900/50'
                        : 'border-current hover:bg-current/20'
                      }`}
                  >
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✓</span>
                  </motion.button>

                  {/* タスク情報 */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-mono truncate ${overdue ? 'text-red-400 font-bold' : ''}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] tracking-wider ${overdue ? 'text-red-500' : 'opacity-60'}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      {task.due_date && (
                        <span className={`text-[10px] ${overdue ? 'text-red-500 animate-pulse font-bold' : 'opacity-40'}`}>
                          DUE: {new Date(task.due_date).toLocaleDateString()}
                          {overdue && ' [DAMAGE_ACTIVE]'}
                        </span>
                      )}
                      {!task.due_date && (
                        <span className="text-[10px] opacity-40">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 削除ボタン */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteTask(task.id)}
                    className="w-6 h-6 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                  >
                    ✕
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* ========== タスク数表示 ========== */}
      {!loading && tasks.length > 0 && (
        <div className={`mt-3 text-center text-[10px] tracking-widest ${overdueCount > 0 ? 'text-red-500 animate-pulse' : 'text-cyan-900/50'
          }`}>
          {tasks.length} ACTIVE_TASK{tasks.length > 1 ? 'S' : ''}
          {overdueCount > 0 && ` | ⚠ ${overdueCount} CAUSING DAMAGE`}
          {overdueCount === 0 && ' | COMPLETE TO HEAL'}
        </div>
      )}
    </div>
  );
}
