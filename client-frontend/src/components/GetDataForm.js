import React, { useState } from 'react'
import axios from 'axios'
import ReactJson from 'react-json-view'
// import DataEditForm from './DataEditForm.js'

function GetDataForm() {
    const [url, setUrl] = useState("");
    let localstorageProductsData = localStorage.getItem('data');
    localstorageProductsData = localstorageProductsData ? JSON.parse(localstorageProductsData) : null;
    const [data, setData] = useState({
        loading: false,
        error: null,
        data: localstorageProductsData
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setData(prevData => ({ loading: true, error: null, data: prevData.data }))

        axios.post('http://localhost:9000/api/v1/data', {
            productUrl: url
        })
            .then(res => {
                setUrl("");
                setData(prevData => {
                    const productsData = prevData.data ? [...prevData.data, res.data.data] : [res.data.data];
                    localStorage.setItem('data', JSON.stringify(productsData));

                    return {
                        loading: false,
                        error: null,
                        data: productsData
                    }
                })
            })
            .catch(err => {
                setData(prevData => ({ loading: false, error: null, data: prevData.data }))
                alert(err.message)
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label
                    htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
                >
                    Search
                </label>
                <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="url"
                        id="default-search"
                        className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Amazon or flipkart washing machine url..."
                        value={url}
                        autoComplete="off"
                        onChange={e => setUrl(e.target.value)}
                        required=""
                    />
                    <button
                        type="button"
                        style={{ right: '100px' }}
                        className="text-white absolute bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => setUrl("")}
                    >
                        X
                    </button>
                    <button
                        type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        disabled={data.loading}
                    >
                        {data.loading ? 'Getting Data...' : 'Search'}
                    </button>
                </div>
            </form>

            <div>
                {data.data && <span>Reviews Count: <b>{data.data.length}</b></span>}
                <a href="https://www.amazon.in/s?k=washing+machine" target="_blank" style={{ backgroundColor: '#131921', color: '#fff', padding: '10px 22px', borderRadius: '3px', fontSize: '0.9rem', marginTop: '25px', marginLeft: '20px' }}>
                    Amazon
                </a>

                <a href="https://www.flipkart.com/search?q=washing+machine" target="_blank" style={{ backgroundColor: '#3366ff', color: '#fff', padding: '10px 22px', borderRadius: '3px', fontSize: '0.9rem', marginTop: '25px', marginLeft: '20px' }}>
                    Flipkart
                </a>

                <a href="https://www.youtube.com/" target="_blank" style={{ backgroundColor: '#E93F33', color: '#fff', padding: '10px 22px', borderRadius: '3px', fontSize: '0.9rem', marginTop: '25px', marginLeft: '20px' }}>
                    Youtube
                </a>

                {data.data && (
                    <button
                        style={{ backgroundColor: '#54af36', color: '#fff', padding: '8px 20px', borderRadius: '3px', fontSize: '0.9rem', marginTop: '25px', marginLeft: '20px' }}
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(data.data, null, 2));
                        }}
                    >
                        Copy
                    </button>
                )}

                {/* https://www.flipkart.com/search?q=washing+machine */}
                <button
                    style={{ backgroundColor: 'crimson', color: '#fff', padding: '8px 20px', borderRadius: '3px', fontSize: '0.9rem', marginTop: '25px', marginLeft: '20px' }}
                    onClick={() => {
                        const shouldDelete = window.confirm("Are you sure you want to delete?");

                        if (shouldDelete) {
                            localStorage.removeItem('data');
                            setData({
                                loading: false,
                                error: null,
                                data: null
                            })
                        }
                    }}
                >
                    Clear
                </button>
            </div>

            <div className="mt-8">
                {data?.data && (
                    <ReactJson
                        name="Washing Machines"
                        src={data.data}
                        // iconStyle="circle"
                        displayDataTypes={false}
                        enableEdit={true}
                        displayObjectSize={false}
                        enableClipboard={true}
                        style={{ fontSize: '1rem' }}
                        onEdit={(edit) => {
                            localStorage.setItem('data', JSON.stringify(edit.updated_src));
                            setData({ loading: false, error: null, data: edit.updated_src })
                        }}
                    />
                )}
            </div>

            {/* <p>{JSON.stringify(data?.data)}</p> */}
        </div >
    )
}

export default GetDataForm