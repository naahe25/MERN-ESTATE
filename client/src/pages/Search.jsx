import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Search = () => {
    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    });

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            try {
                const res = await fetch(`/api/listing/get?${searchQuery}`);
                const data = await res.json();
                if (data.length < 9) {
                    setShowMore(false);
                } else {
                    setShowMore(true);
                }
                setListings(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setSidebarData({
            ...sidebarData,
            [id]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        try {
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length < 9) {
                setShowMore(false);
            }
            setListings([...listings, ...data]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8 py-7'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>
                            Search Term:
                        </label>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Type:</label>
                        <select
                            id='type'
                            className='border rounded-lg p-3 w-full'
                            value={sidebarData.type}
                            onChange={handleChange}
                        >
                            <option value='all'>All</option>
                            <option value='rent'>Rent</option>
                            <option value='sale'>Sale</option>
                        </select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Offer:</label>
                        <input
                            type='checkbox'
                            id='offer'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebarData.offer}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Furnished:</label>
                        <input
                            type='checkbox'
                            id='furnished'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebarData.furnished}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Parking:</label>
                        <input
                            type='checkbox'
                            id='parking'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebarData.parking}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select
                            onChange={handleChange}
                            defaultValue={'createdAt'}
                            id='sort'
                            className='border rounded-lg p-3 w-full'
                        >
                            <option value='regularPrice'>Price low to high</option>
                            <option value='regularPrice'>Price high to low</option>
                            <option value='createdAt'>Latest</option>
                            <option value='createdAt'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                    Listing results:
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listings found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 w-full text-center'>
                            Loading...
                        </p>
                    )}
                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}
                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-7 text-center w-full'
                        >
                            Show more listings
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
