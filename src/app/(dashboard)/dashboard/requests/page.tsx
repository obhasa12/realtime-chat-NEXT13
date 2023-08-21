import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helper/redis';
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import { FC } from 'react'

const page: FC = async ({}) => {
    const session = await getServerSession(authOptions);
    if(!session) notFound();

    const incomingSenderIds = await fetchRedis('smembers', `${session.user.id}:incoming_friend_requests`) as string[];

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const sender = await fetchRedis('get', `user:${senderId}`) as string;
            const senderParse = JSON.parse(sender) as User;
            return {
                senderId,
                senderEmail: senderParse.email,
            };
        })
    );

  return <main className='pt-8'>
    <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
        <div className="flex flex-col gap-4">
            <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
        </div>
  </main>
}

export default page;