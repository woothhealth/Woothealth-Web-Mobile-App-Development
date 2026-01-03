'use client'

import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { FaBookOpen } from 'react-icons/fa';
// import { FaArrowRightLong, FaCalendar } from 'react-icons/fa6';

const Providers = () => {
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blog posts data - In a real app, this would come from the admin dashboard
  // const mockPosts = [
  // ];

  const categories = [
    "Provider Name",
    "Address",
    "State"
  ];

  const header = [
    "Provider Name",
    "Address",
    "State"
  ]

  // useEffect(() => {
  //   // Simulate API call
  //   const fetchPosts = async () => {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setPosts(mockPosts);
  //       setLoading(false);
  //     }, 800);
  //   };

  //   fetchPosts();
  // }, []);

  // const filteredPosts = posts.filter(post => {
  //   const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) || post.category.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });

  // const featuredPost = posts.find(post => post.featured);
  // const regularPosts = filteredPosts.filter(post => !post.featured || searchTerm || selectedCategory !== 'all');

  return (
    <section className='py-4 md:p-4 my-4'>
        <section className='flex items-center flex-col py-8 text-[#120052] text-center space-y-2 px-4'>
            <h2 className='text-[35px] font-bold'>Find Quality Healthcare Near You</h2>
            <p className='text-lg md:w-172'>Search thousands of trusted hospitals, Pharmacy, Dental Clinics, Diagnostic Centers and Wellness &Therapy Facilities across Nigeria.</p>
        </section>
      {/* Search and Filter */}
      <section className="pb-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by provider name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 px-3 placeholder:text-[0.95rem] rounded-xl bg-[#F8F9FA] outline-[#E5E7EB] w-full sm:w-64 outline-1"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 appearance-none py-2 px-3 placeholder:text-[0.95rem] rounded-xl bg-[#F8F9FA] outline-[#E5E7EB] outline-1"
              >
                <option value="all">State</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 placeholder:text-[0.95rem] rounded-xl bg-[#F8F9FA] outline-[#E5E7EB] outline-1 w-full sm:w-48 appearance-none"
              >
                <option value="all">All</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button value='submit' className='btn rounded-sm px-16 py-2'>
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="md:w-[85%] mx-auto">
        <table className='grid grid-cols-3 rounded-t-2xl bg-[#49A5EF] items-start md:px-6'>
          {header.map((head, index) => {
            return (<thead key={index} className='text-[#FFFFFF] py-3 text-lg'>
              <tr>
                <th>
                  {head}
                </th>
              </tr>
              </thead>)
          })}
        </table>
        
      {/* Featured Post */}
      {/* {featuredPost && !searchTerm && selectedCategory === 'all' && (
        <div></div>
      )} */}

      {/* Blog Posts Grid */}
      {/* <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card-elegant animate-pulse">
                  <div className="h-4 bg-gray-medium rounded mb-4"></div>
                  <div className="h-6 bg-gray-medium rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-medium rounded"></div>
                    <div className="h-3 bg-gray-medium rounded w-3/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-medium rounded w-20"></div>
                    <div className="h-3 bg-gray-medium rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* {regularPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post, index) => (
                    <article key={post.id} className="card-elegant hover-lift animate-fade-in">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {post.category}
                        </span>
                        <span className="text-caption text-muted-foreground">
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-3">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="hover:text-gold transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-muted-foreground mb-4 text-sm">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-caption text-muted-foreground">
                          <FaCalendar className="h-3 w-3 mr-1" />
                          {post.date}
                        </div>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-primary hover:text-gold transition-colors inline-flex items-center text-sm"
                        >
                          Read More <FaArrowRightLong className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FaBookOpen className="h-16 w-16 text-[#000000] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Provider Found</h3>
                  <p className="text-muted-foreground">
                    Try again Later.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section> */}
      </section>
    </section>
  );
};

export default Providers;