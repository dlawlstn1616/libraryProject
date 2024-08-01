import { useEffect, useRef, useState } from 'react';
import './LibrarySearch.css';
import axiosInstance from './AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function LibrarySearch() {
    const [search, setSearch] = useState('');
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [showFilteredTable, setShowFilteredTable] = useState(false);
    const refSearch = useRef();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            alert("로그인이 필요한 서비스입니다.");
            navigate('/login');
            return;
        }

        // 초기 로딩 시 모든 도서 목록을 불러옴
        axiosInstance
            .get('/books')
            .then(response => {
                console.log('API Response:', response); // API 응답 확인
                if (response && response.data) {
                    setBooks(response.data);
                }
            })
            .catch(err => console.log('API Error:', err));
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (search.trim() === '') {
            setShowFilteredTable(false);
            return;
        }
        handleSearch(search);
    }, [search]);

    const handleSearch = (searchTerm) => {
        searchTerm = searchTerm.toLowerCase();
        if (Array.isArray(books)) {
            const results = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm)
            );
            setFilteredBooks(results);
            setShowFilteredTable(true);
        } else {
            console.log('Books is not an array:', books); // books가 배열이 아닐 때 디버그
        }
    };

    const relatedBooks = Array.isArray(books) ? books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div className='App'>
            <div className="search-container">
                <input
                    className="search-input"
                    placeholder="검색할 책 제목"
                    type="text"
                    ref={refSearch}
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setShowFilteredTable(false); // 연관 검색어를 먼저 보여줌
                        if (e.target.value === '') {
                            setShowFilteredTable(false);
                        }
                    }}
                />
                <button className="search-btn" onClick={() => handleSearch(search)}>검색</button>
                {search && !showFilteredTable && (
                    <div className="related-books-box">
                        <ul>
                            {relatedBooks.map(book => (
                                <li key={book.bookIdx} onClick={() => {
                                    setSearch(book.title);
                                    handleSearch(book.title);
                                }}>
                                    {book.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showFilteredTable ? (
                    <div className="table-container">
                        <table>
                            <colgroup>
                                <col width="15%" />
                                <col width="*" />
                                <col width="15%" />
                                <col width="20%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">책번호</th>
                                    <th scope="col">제목</th>
                                    <th scope="col">저자</th>
                                    <th scope="col">출판사</th>
                                    <th scope="col">출판일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map(book => (
                                    <tr key={book.bookIdx} onClick={() => navigate(`/detail/${book.bookIdx}`, { state: { bookIdx: book.bookIdx } })}>
                                        <td>{book.bookIdx}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publisher}</td>
                                        <td>{book.publishDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <colgroup>
                                <col width="15%" />
                                <col width="*" />
                                <col width="15%" />
                                <col width="20%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">책번호</th>
                                    <th scope="col">제목</th>
                                    <th scope="col">저자</th>
                                    <th scope="col">출판사</th>
                                    <th scope="col">출판일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(books) && books.map(book => (
                                    <tr key={book.bookIdx} onClick={() => navigate(`/detail/${book.bookIdx}`, { state: { bookIdx: book.bookIdx } })}>
                                        <td>{book.bookIdx}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publisher}</td>
                                        <td>{book.publishDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}