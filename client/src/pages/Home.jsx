import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';
import ListingItem from '../components/ListingItem';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    const [allListings, setAllListings] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=4');
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchAllListings = async () => {
            try {
                const res = await fetch('/api/listing/get?limit=20');
                const data = await res.json();
                setAllListings(shuffleArray(data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchOfferListings();
        fetchAllListings();
    }, []);

    return (
        <div>
            {/* top hero */}
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
                    Find your next <span className='text-slate-500'>perfect</span>
                    <br />
                    place with ease
                </h1>
                <div className='text-gray-400 text-xs sm:text-sm'>
                    Sahand Estate is the best place to find your next perfect place to
                    live.
                    <br />
                    We have a wide range of properties for you to choose from.
                </div>
                <Link
                    to={'/search'}
                    className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
                >
                    Let's get started...
                </Link>
            </div>

            {/* ── All Listings Auto Slideshow ── */}
            {allListings.length > 0 && (
                <div className='max-w-6xl mx-auto px-3 mb-10'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-xl font-semibold text-slate-600 tracking-wide'>
                            ✦ Featured Properties
                        </h2>
                        <Link
                            to='/search'
                            className='text-sm text-blue-700 hover:underline font-medium'
                        >
                            Browse all →
                        </Link>
                    </div>

                    <div className='relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white'>
                        <Swiper
                            modules={[Autoplay, EffectFade]}
                            effect='fade'
                            autoplay={{ delay: 3200, disableOnInteraction: false }}
                            loop={true}
                            speed={900}
                            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                            className='w-full'
                        >
                            {allListings.map((listing, idx) => (
                                <SwiperSlide key={listing._id}>
                                    <Link to={`/listing/${listing._id}`}>
                                        <div className='relative h-[340px] sm:h-[420px] w-full'>
                                            <img
                                                src={
                                                    listing.imageUrls?.[0] ||
                                                    'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400'
                                                }
                                                alt={listing.name}
                                                className='w-full h-full object-cover'
                                            />

                                            {/* gradient overlay */}
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent' />

                                            {/* type + offer badges */}
                                            <div className='absolute top-4 left-4 flex gap-2'>
                                                <span
                                                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${listing.type === 'rent'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-emerald-600 text-white'
                                                        }`}
                                                >
                                                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                                </span>
                                                {listing.offer && (
                                                    <span className='text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500 text-white'>
                                                        Offer
                                                    </span>
                                                )}
                                            </div>

                                            {/* slide counter */}
                                            <div className='absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full'>
                                                {idx + 1} / {allListings.length}
                                            </div>

                                            {/* info bar */}
                                            <div className='absolute bottom-0 left-0 right-0 p-5 text-white'>
                                                <p className='text-lg sm:text-2xl font-bold truncate drop-shadow-md'>
                                                    {listing.name}
                                                </p>
                                                <div className='flex items-center gap-1 mt-1 text-sm text-slate-200'>
                                                    <MdLocationOn className='text-emerald-400 flex-shrink-0' />
                                                    <span className='truncate'>{listing.address}</span>
                                                </div>
                                                <div className='flex items-center justify-between mt-3'>
                                                    <div className='flex gap-4 text-sm text-slate-200'>
                                                        <span className='flex items-center gap-1'>
                                                            <FaBed className='text-slate-300' />
                                                            {listing.bedrooms}{' '}
                                                            {listing.bedrooms === 1 ? 'bed' : 'beds'}
                                                        </span>
                                                        <span className='flex items-center gap-1'>
                                                            <FaBath className='text-slate-300' />
                                                            {listing.bathrooms}{' '}
                                                            {listing.bathrooms === 1 ? 'bath' : 'baths'}
                                                        </span>
                                                    </div>
                                                    <p className='text-xl font-extrabold text-white drop-shadow'>
                                                        $
                                                        {(listing.offer
                                                            ? listing.discountPrice
                                                            : listing.regularPrice
                                                        ).toLocaleString('en-US')}
                                                        {listing.type === 'rent' && (
                                                            <span className='text-sm font-normal text-slate-300'>
                                                                {' '}/mo
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* animated dot indicators */}
                        <div className='flex justify-center gap-1.5 py-3 bg-white'>
                            {allListings.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`block rounded-full transition-all duration-300 ${idx === activeSlide
                                        ? 'w-5 h-2 bg-slate-700'
                                        : 'w-2 h-2 bg-slate-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* swiper (offer listings hero) */}
            <Swiper navigation modules={[Navigation]}>
                {offerListings &&
                    offerListings.length > 0 &&
                    offerListings.map((listing) => (
                        <SwiperSlide key={listing._id}>
                            <div
                                style={{
                                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                                className='h-[500px]'
                            ></div>
                        </SwiperSlide>
                    ))}
            </Swiper>

            {/* listing results for offer, sale and rent */}
            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {offerListings && offerListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                            <Link
                                className='text-sm text-blue-800 hover:underline'
                                to={'/search?offer=true'}
                            >
                                Show more offers
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {rentListings && rentListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>
                                Recent places for rent
                            </h2>
                            <Link
                                className='text-sm text-blue-800 hover:underline'
                                to={'/search?type=rent'}
                            >
                                Show more places for rent
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {saleListings && saleListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>
                                Recent places for sale
                            </h2>
                            <Link
                                className='text-sm text-blue-800 hover:underline'
                                to={'/search?type=sale'}
                            >
                                Show more places for sale
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {saleListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}