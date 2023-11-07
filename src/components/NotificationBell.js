import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import Badge from '@mui/material/Badge';

export default function NotificationBell({ userUid }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (userUid) {
        try {
          const docRef = doc(db, 'profileData', userUid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setNotifications(docSnap.data().notifications || []);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
      setLoading(false);
    }

    fetchNotifications();
  }, [userUid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const notificationCount = notifications.length;

  return (
    <div>
      {notificationCount === 0 ? (
        <BellSlashIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
      ) : (
        <Badge badgeContent={notificationCount} color="primary">
          <BellIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
        </Badge>
      )}
    </div>
  );
}
