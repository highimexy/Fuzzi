'use client'

import {
  FiEdit3,
  FiArrowUp,
  FiEye,
  FiMessageSquare,
  FiMoreHorizontal,
  FiUser,
  FiCheckCircle,
  FiStar,
} from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

const DISCUSS_POSTS = [
  {
    id: 1,
    isVerified: true,
    author: 'AcademyTeam',
    date: 'Apr 27, 2026',
    title: 'Would you trust AI code as is?',
    excerpt:
      "Would you ship AI-generated code without review? Sometimes it looks like the perfect solution at first glance... Then you run it and you realize: looking right isn't the same as being right. ☝️ Now it's your turn...",
    upvotes: 6,
    views: '1.9K',
    comments: 27,
  },
  {
    id: 2,
    author: 'AcademyTeam',
    date: 'Apr 16, 2026',
    title: 'Academy App at Your Fingertips',
    excerpt:
      'Introducing the Academy mobile app, now available for smartphones and tablets. One challenge a day keeps your reasoning in play. Jump in for quick practice, browse your collections, and stay on top of...',
    upvotes: 162,
    views: '30K',
    comments: 75,
  },
  {
    id: 3,
    isVerified: true,
    author: 'AcademyTeam',
    date: 'Apr 13, 2026',
    title: '💥 Contest Rating Rule Updates 💥',
    excerpt:
      'Hello everyone, To maintain the integrity and accuracy of Academy Contest Rating and Global Ranking, we are introducing updates to the contest rating rules. I. Applicability New Users: Users who have not participated...',
    upvotes: 93,
    views: '16.2K',
    comments: 39,
  },
  {
    id: 4,
    isVerified: true,
    author: 'Anonymous User',
    date: 'an hour ago',
    title: 'Need some advice',
    excerpt:
      'i was laid off in feb.i have got an offer from eclerx as a java developer should i take it .my aim is to work in a good product based company ,need some suggestions on this',
    upvotes: 0,
    views: '28',
    comments: 0,
  },
]

const TABS = ['For You', 'Career', 'Contest', 'Compensation', 'Feedback', 'Interview']

export function AcademyDiscussBoard() {
  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* === LEWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* === ŚRODKOWY KONTENT === */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col p-8 xl:max-w-5xl">
        {/* === TOP NAVIGATION === */}
        <div className="border-foreground/10 flex border-b py-2">
          <div className="flex flex-1 items-center">
            <button className="border-foreground/10 flex cursor-pointer items-center border-r font-bold">
              <span className="text-lg">🔥</span>
              <span className="mr-2">For You</span>
            </button>
            {TABS.slice(1).map((tab) => (
              <button
                key={tab}
                className="border-foreground/20 hover:text-foreground/80 cursor-pointer border-r"
              >
                <span className="mr-2 ml-2">{tab}</span>
              </button>
            ))}
          </div>

          <button className="flex cursor-pointer items-center gap-2 border bg-yellow-500/10 px-2 font-bold text-yellow-500 hover:bg-yellow-500/20">
            <FiEdit3 className="text-lg" />
            <span className="">Create</span>
          </button>
        </div>

        {/* === SORTING BAR === */}
        <div className="text-foreground/60 border-foreground/10 mt-2 flex items-center gap-4 border-b pb-2">
          <button className="hover:text-foreground border-foreground/10 flex cursor-pointer items-center gap-2 border-r">
            <FiArrowUp className="text-base" /> <span className="mr-2">Most Votes</span>
          </button>
          <button className="hover:text-foreground flex cursor-pointer items-center gap-2">
            <FiStar className="text-base" /> Newest
          </button>
        </div>

        {/* === POST LIST === */}
        <div className="flex flex-col">
          {DISCUSS_POSTS.map((post) => (
            <div
              key={post.id}
              className="border-foreground/10 flex cursor-pointer flex-col gap-4 border-b"
            >
              {/* Treść posta */}
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-2">
                <div className="text-foreground/60 flex items-center gap-1 pb-2 text-xs">
                  <div className="flex items-center justify-center">
                    <FiUser className="text-md" />
                  </div>
                  <span className="text-foreground/80 font-bold">{post.author}</span>
                  {post.isVerified && <FiCheckCircle className="text-blue-500" />}
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                {/* NAPRAWIONY HEADING: Zmiana z h3 na h2 */}
                <h2 className="font-serif text-base font-bold sm:text-lg">{post.title}</h2>

                <p className="line-clamp-2 pb-2 text-sm text-zinc-400 sm:text-base">
                  {post.excerpt}
                </p>

                <div className="text-foreground/50 flex items-center justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="flex items-center gap-1 transition-colors hover:text-yellow-500">
                      <FiArrowUp className="text-base" /> {post.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye className="text-base" /> {post.views}
                    </span>
                    <span className="flex items-center gap-1 transition-colors">
                      <FiMessageSquare className="text-base" /> {post.comments}
                    </span>
                  </div>

                  <button className="hover:bg-foreground/10 hover:text-foreground rounded-md p-2 transition-colors hover:cursor-pointer">
                    <FiMoreHorizontal className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          <button className="text-foreground hover:text-foreground/80 cursor-pointer font-bold uppercase transition-opacity">
            Load more
          </button>
        </div>
      </div>

      {/* === PRAWA SIATKA === */}
      {/* flex-1 rozciąga ją na resztę wolnego miejsca z prawej strony */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
