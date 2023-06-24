import { useState, useEffect } from "react"
import NoImageAvailable from "../../assets/NoImageAvailabe.jpg"
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom'
import AddCartButton from "../../components/AddCartButton";
import * as Slider from '@radix-ui/react-slider';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'

import { cartStore } from "../../lib/stores";

import axios from "axios";

import { shortify } from "../../lib";

const googleBookApiKey = "AIzaSyDcxjIPivXvC1bSOaVn_LUkDgMHfHm0P0k";

export default function Shop() {
    const { session } = useAuthContext();

    const addItem = cartStore((state) => state.addItem)

    const [openFilters, setOpenFilters] = useState(true);
    const [books, setBooks] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [filter, setFilter] = useState({
        title: '',
        author: '',
        maxPrice: 70000,
        genre: [],
        yearOfPublishing: 2000,
    })
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        if (!session) {
            navigate("/signin");
        }

        const fetchBooks = async () => {
            const startIndex = Math.floor(Math.random() * 100) + 1; // Generate a random start index
            const maxResults = 40

            const searchQueries = ['library', 'books', 'volumes', 'science', 'technology', 'education', 'fantasy', 'thriller', 'horror']

            const searchQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];

            await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&filter=paid-ebooks&startIndex=${startIndex}&maxResults=${maxResults}&key=${googleBookApiKey}`)
                .then((response) => {
                    console.log(response)
                    const data = response.data.items
                    if (data.length > 0) {
                        setBooks((prevBooks) => [...prevBooks, ...data]);
                        setFilteredData((prevData) => [...prevData, ...data]);
                        setHasMore(data?.length > 0);
                    }
                }).catch((err) => {
                    console.log(err);
                    setError(true)
                }).finally(() => {
                    setIsLoading(false);
                })
        };

        fetchBooks()
    }, [pageNumber]);

    const resetFilter = () => {
        setFilter({
            title: '',
            author: '',
            maxPrice: 70000,
            genre: [],
            yearOfPublishing: 2000,
        })
        setFilteredData(books)
    }

    const handleFilter = async () => {
        const filteredBooks = books.filter((item) => {
            const isIncludedTitle = filter.title.length === 0 || item.volumeInfo?.title.toLowerCase().includes(filter.title.toLowerCase());
            const isIncludedAuthor = filter.author.length === 0 || item.volumeInfo?.authors?.some((author) => author.toLowerCase().includes(filter.author.toLowerCase()));
            const isBelowMaxPrice = (item.saleInfo?.listPrice?.amount || 0) <= filter.maxPrice;

            return isIncludedTitle && isIncludedAuthor && isBelowMaxPrice;
        }).sort((a, b) => b.saleInfo?.listPrice?.amount - a.saleInfo?.listPrice?.amount);

        setFilteredData(filteredBooks);

        if (filteredBooks.length === 0 && (filter.title.length > 0 || filter.author.length > 0)) {
            const searchQuery = filter.title || filter.author;
            const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&filter=paid-ebooks&startIndex=0&maxResults=40&key=${googleBookApiKey}`;

            try {
                setIsLoading(true);
                const response = await axios.get(apiUrl);
                const books = response.data.items;

                if (books) {
                    setFilteredData((prevFilteredData) => [...prevFilteredData, ...books]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

    };

    const fetchMoreData = () => {
        resetFilter()
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
    };

    if (isLoading) {
        return (
            <div className="w-full h-full bg-gray-900 text-white grid grid-cols-1 grid-rows-1 place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-repeat animate-spin" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                </svg>
            </div>
        )
    }

    return (
        <div className="flex flex-col relative h-full sm:flex-row">
            {error ? <div className="flex text-5xl font-bold justify-center items-center w-full">
                Try again later...
            </div> :
                <>
                    <div className='sticky top-0 w-full  sm:w-[30%] sm:mx-4'>
                        <button className="sm:hidden bg-white text-blue-600 w-full font-bold p-2" onClick={() => { setOpenFilters(!openFilters) }}>Filters</button>
                        <div className={`${!openFilters ? 'hidden' : 'flex flex-col justify-between'} h-[500px] border bg-[#5367FF] border-white p-4 rounded-md sm:flex flex-col justify-between sm:mt-10 `}>
                            <div>
                                <p className="font-bold text-xl">Filters</p>
                                <div className="flex flex-col gap-2">
                                    <input type="text" value={filter.title} className="w-full" placeholder="Title" onChange={(e) => { setFilter({ ...filter, title: e.target.value }) }} />
                                    <input type="text" value={filter.author} className="w-full" placeholder="Author" onChange={(e) => { setFilter({ ...filter, author: e.target.value }) }} />
                                </div>

                                <div className="mt-4">
                                    <p className="font-bold">Max Price</p>
                                    <Slider.Root className="SliderRoot" value={[filter.maxPrice]} defaultValue={[filter.maxPrice]} max={70000} step={1} onValueChange={(e) => {
                                        setFilter({ ...filter, maxPrice: e })
                                    }}>
                                        <Slider.Track className="SliderTrack">
                                            <Slider.Range className="SliderRange" />
                                        </Slider.Track>
                                        <Slider.Thumb className="SliderThumb" aria-label="Volume" />
                                    </Slider.Root>
                                    <div className="flex w-full justify-between font-mono">
                                        <span>0</span>
                                        <span>{filter.maxPrice}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex gap-2 justify-end">
                                <button onClick={resetFilter} className="border border-white px-4 py-1 rounded-md bg-white text-black">Reset</button>
                                <button onClick={handleFilter} className="border border-white px-4 py-1 rounded-md bg-white text-black">Apply</button>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col gap-4 w-full mt-10">
                        {filteredData.length > 0 ? <InfiniteScroll
                            dataLength={filteredData.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={<p>No more books to display.</p>}
                        >
                            {filteredData?.length > 0 &&
                                filteredData.map((book) => (
                                    <div key={book.id} className="border border-white rounded-md p-3 m-4 gap-2 flex flex-col sm:flex-row mb-4">
                                        {/* Book content */}
                                        <div>
                                            <div className="w-40 h-52 mx-auto">
                                                <img src={book.volumeInfo?.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail || NoImageAvailable} className="w-full h-full" />
                                            </div>
                                            <AddCartButton price={`₹${Math.round(book.saleInfo?.listPrice?.amount) || 'NO PRICE'}`}
                                                onClick={() => {
                                                    if (book.saleInfo?.listPrice?.amount) {
                                                        toast.success('Added to Cart!')
                                                        addItem(book)
                                                    }
                                                }} />
                                        </div>

                                        <Link to={`/books/${book.id}`} className="p-2 flex flex-col justify-between w-full bg-white text-black rounded-md">
                                            <div>
                                                <p className="font-bold text-xl">{book.volumeInfo?.title}</p>
                                                <p className="text-lg font-medium">by {book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
                                                <hr className="bg-black h-[2px]" />

                                                <p className="mt-2">{shortify(book?.volumeInfo?.description)}</p>
                                            </div>
                                            <div className="flex justify-between w-full">
                                                <p className="text-lg font-mono">Total Pages: {book.volumeInfo?.pageCount || 'NO RECORD'}</p>

                                                {book?.volumeInfo?.maturityRating !== 'NOT_MATURE' ?
                                                    <p className="mt-2">Mature Content</p> : null}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </InfiniteScroll> :
                            <div className="flex text-5xl font-bold justify-center items-center w-full">
                                No Book Found!
                            </div>
                        }

                    </div>
                </>}

        </div>
    )
}
