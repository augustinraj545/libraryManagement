import { useState, useEffect } from 'react'
import Marquee from "react-fast-marquee";
import axios from 'axios';
import { Link } from 'react-router-dom';
import NoImageAvailable from "../../assets/NoImageAvailabe.jpg"
const googleBookApiKey = "AIzaSyBUBm7pc6dEgVcNrGB7DErr86nRX0b8JSg";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const [books, setBooks] = useState([])

  useEffect(() => {

    const searchQueries = ['library', 'books', 'volumes', 'science', 'technology', 'education', 'fantasy', 'thriller', 'horror']

    const searchQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];

    const initialBooks = async () => {
      await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&filter=paid-ebooks&maxResults=10&key=${googleBookApiKey}`)
        .then((response) => {
          console.log(response)
          const data = response.data.items
          setBooks(data);
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          setIsLoading(false);
        })
    }

    initialBooks()
  }, []);

  return (
    <div className='h-full max-w-7xl mx-auto'>
      <div className='flex pt-10 h-full items-center justify-center'>
        <div className='w-2/4'>
          <div className='text-8xl font-bold'>
            Book Marketplace
          </div>
          <div className='mt-4 text-3xl text-slate-600'>
          Embark on a bookish odyssey, immersing yourself in a world of captivating stories.
          </div>
        </div>
        <Marquee gradient={false} speed={45} className='mx-20'>
          {books.length > 0 ? books.map((book) => {
            return (
              <Link to={`/books/${book.id}`} className='h-[300px] w-[200px] mx-10'>
                <img src={book.volumeInfo?.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail || NoImageAvailable} className="h-[300px] w-[200px] mx-4" />
              </Link>
            )
          }) :
            <div className='flex'>
              <div className='h-[300px] w-[200px] mx-2'>
                <div className='h-full flex items-center justify-center bg-red-400'>
                  Fantasy
                </div>
              </div>
              <div className='h-[300px] w-[200px] mx-2'>
                <div className='h-full flex items-center justify-center bg-yellow-400'>
                  Science
                </div>
              </div>
              <div className='h-[300px] w-[200px] mx-2'>
                <div className='h-full flex items-center justify-center bg-green-400'>
                  Fiction
                </div>
              </div>
              <div className='h-[300px] w-[200px] mx-2'>
                <div className='h-full flex items-center justify-center bg-blue-400'>
                  Drama
                </div>
              </div>
            </div>
          }
        </Marquee>
      </div>
    </div>
  )
}
