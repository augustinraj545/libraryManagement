import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddCartButton from '../../components/AddCartButton';
import axios from 'axios';
import { shortify } from '../../lib';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import { cartStore } from "../../lib/stores";

const googleBookApiKey = "AIzaSyBUBm7pc6dEgVcNrGB7DErr86nRX0b8JSg";
export default function Books() {
  const { session } = useAuthContext();

  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const addItem = cartStore((state) => state.addItem)

  useEffect(() => {
    if (!session) {
      navigate("/signin");
    }

    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}?key=${googleBookApiKey}`
        );
        const bookData = response.data;
        console.log(bookData);
        setBook(bookData);

        if (bookData.volumeInfo?.categories) {
          const category = bookData.volumeInfo.categories[0]; // Assuming the first category for simplicity
          fetchRecommendations(category);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRecommendations = async (category) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=4&key=${googleBookApiKey}`
        );
        const recommendationsData = response.data.items;
        setRecommendations(recommendationsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col h-full'>
      <div className="m-10 p-2 gap-2 flex flex-col sm:flex-row">
        {/* Book content */}
        <div>
          <div className="w-72 h-96 mx-auto">
            <img
              src={
                book.volumeInfo?.imageLinks?.thumbnail ||
                book.volumeInfo.imageLinks?.smallThumbnail ||
                NoImageAvailable
              }
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="p-2 flex flex-col justify-between w-full text-white">
          <div>
            <p className="font-bold text-6xl">{book.volumeInfo?.title}</p>
            <p className="text-xl font-medium">
              by {book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}
            </p>

            <hr className="bg-black h-[2px] my-4" />
            <p className="mt-2">{shortify(book?.volumeInfo?.description)}</p>

            <div className='mt-2 font-mono'>
              <p>
              </p>
              <p className="text-lg">
                Pages: {book.volumeInfo?.pageCount || 'NO RECORD'}
              </p>
              <p>
                {book?.volumeInfo?.maturityRating === 'NOT_MATURE' ? (
                  "Not Mature Content"
                ) : "Mature Content"}
              </p>

            </div>

          </div>

          <div className='flex flex-col w-full items-end'>
            <p>
              Published By {book.volumeInfo?.publisher || 'NO RECORD'}, {book.volumeInfo?.publishedDate || 'NO RECORD'}
            </p>
            <AddCartButton price={`₹.${book.saleInfo?.listPrice?.amount || 'NO PRICE'}`}
              onClick={() => {
                if (book.saleInfo?.listPrice?.amount) {
                  toast.success('Added to Cart!')
                  addItem(book)
                }
              }} />
            <div className="flex justify-between w-full">

              {book?.volumeInfo?.maturityRating !== 'NOT_MATURE' ? (
                <p className="mt-2">Mature Content</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='flex flex-col h-full'>
          <p className='text-5xl font-bold m-10 mb-4'>Recommendations</p>
          <div className='grid grid-cols-4 w-full justify-around h-full p-10'>
            {recommendations?.length > 0 ? recommendations.map((recommendation) => (
              <Link to={`/books/${recommendation.id}`} key={recommendation.id}>
                <div className="group relative h-full w-full max-w-xs gap-2 flex flex-col justify-center sm:flex-row">
                  <img src={recommendation.volumeInfo?.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail || NoImageAvailable} className='w-full h-full' />
                  <div className='h-full w-full max-w-xs opacity-60 group-hover:bg-black absolute' />
                  <div className="p-4 hidden rounded-md group-hover:flex flex-col absolute text-white h-full w-full">
                    <div>
                      <p className="font-bold">{recommendation.volumeInfo?.title}</p>
                      <p className="text-xs font-medium">by {recommendation.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
                      <hr className="bg-black h-[2px]" />
                      <div>Price: ₹. {`${recommendation.saleInfo?.listPrice?.amount || 'NO PRICE'}`}</div>
                    </div>

                    <div className="flex justify-between w-full">
                      <p className="text-lg font-mono">Total Pages: {recommendation.volumeInfo?.pageCount || 'NO RECORD'}</p>

                      {recommendation?.volumeInfo?.maturityRating !== 'NOT_MATURE' ?
                        <p className="mt-2">Mature Content</p> : null}
                    </div>
                  </div>
                </div>
              </Link>
            )) :
              <div className='text-4xl'>
                Not at the moment
              </div>}
          </div>

        </div>
      </div>

    </div>
  );
}
