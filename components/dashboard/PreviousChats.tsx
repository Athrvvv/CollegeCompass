type Chat = {
  id: number
  title: string
}

export default function PreviousChats({ chats }: { chats: Chat[] }) {
  return (
    <div className="space-y-3">

      {chats.map((chat) => (
        <div
          key={chat.id}
          className="bg-slate-800 hover:bg-slate-700 transition cursor-pointer rounded-md px-3 py-2 text-xs text-slate-300 truncate"
        >
          {chat.title}
        </div>
      ))}

    </div>
  )
}