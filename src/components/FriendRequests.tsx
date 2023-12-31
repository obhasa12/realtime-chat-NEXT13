'use client';

import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequests: incomingFriendRequest[];
    sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequests, sessionId}) => {
    const [friendRequests, setFriendRequest] = useState<incomingFriendRequest[]>(
        incomingFriendRequests
    );
    const router = useRouter();

    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', { id: senderId });

        setFriendRequest((prev) => 
            prev.filter((request) => request.senderId !== senderId)
        );

        router.refresh();
    };

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', { id: senderId });

        setFriendRequest((prev) => 
            prev.filter((request) => request.senderId !== senderId)
        );

        router.refresh();
    };

  return (<>
        {friendRequests.length === 0?(
            <p className='text-sm text-zinc-500'>Nothing to show here ...</p>
        ): (
            friendRequests.map((request) => (
                <div key={request.senderId} className='flex gap-4 items-center'>
                    <UserPlus className='text-black' />
                    <p className='font-medium text-lg'>{request.senderEmail}</p>
                    <button aria-label='accept friend' onClick={() => acceptFriend(request.senderId)} className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                        <Check className='font-semibold text-white w-3/4 h-3/4' />
                    </button>
                    <button aria-label='deny friend' onClick={() => denyFriend(request.senderId)} className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                        <X className='font-semibold text-white w-3/4 h-3/4' />
                    </button>
                </div>
            ))
        )}
    </>
    )
}

export default FriendRequests