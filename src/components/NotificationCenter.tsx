import React, { useState } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import { Notification } from '../types';
import { formatDateTime } from '../utils/dateUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', [
    {
      id: '1',
      title: 'قانون جديد',
      message: 'تم نشر تعديل جديد على قانون الإجراءات المدنية والإدارية',
      type: 'new_law',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      relatedLegalTextId: '2'
    },
    {
      id: '2',
      title: 'مرسوم تنفيذي',
      message: 'صدر مرسوم تنفيذي جديد رقم 23-145 المتعلق بتنظيم المهن القانونية',
      type: 'new_law',
      isRead: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'تذكير جلسة',
      message: 'لديك جلسة غداً في قضية أحمد بن علي',
      type: 'reminder',
      isRead: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_law':
        return <AlertCircle className="text-blue-500" size={20} />;
      case 'amendment':
        return <Info className="text-orange-500" size={20} />;
      case 'reminder':
        return <Clock className="text-green-500" size={20} />;
      case 'system':
        return <CheckCircle className="text-purple-500" size={20} />;
      default:
        return <Bell className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
          <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">الإشعارات</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    تحديد الكل كمقروء
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-full hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex gap-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="تحديد كمقروء"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="حذف"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {formatDateTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="mx-auto text-slate-400 mb-2" size={32} />
                <p className="text-slate-500">لا توجد إشعارات</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                عرض جميع الإشعارات
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;