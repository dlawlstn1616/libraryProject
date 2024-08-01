import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";
import './LibraryDetail.css';

export default function LibraryDetail() {
    const [book, setBook] = useState({});
    const [files, setFiles] = useState([]);
    const location = useLocation();
    const { bookIdx: bookIdxFromParams } = useParams();
    const bookIdxFromState = location.state?.bookIdx;
    const bookIdx = bookIdxFromState || bookIdxFromParams;
    const navigate = useNavigate();

    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token'); // JWT 토큰 가져오기

    useEffect(() => {
        if (bookIdx) {
            axiosInstance
                .get(`/books/${bookIdx}/files`)
                .then(res => {
                    if (res && res.data) {
                        setBook(res.data.book);
                        setFiles(res.data.files);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [bookIdx]);

    const formatDate = (datetime) => {
        if (!datetime) return '';
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const deleteButtonClick = e => { 
        e.preventDefault();
        if (window.confirm('정말로 이 책을 삭제하시겠습니까?')) {
            axiosInstance
                .delete(`/books/${bookIdx}`)
                .then(res => {
                    if (res && res.status === 204) {
                        navigate('/search');
                    }
                })
                .catch(err => console.log(err));
        }
    };

    const updateButtonClick = e => {
        e.preventDefault();
        navigate('/update', { state: { book } });
    };

    // 파일 다운로드 핸들러
    const handleDownload = (e, file) => {
        e.preventDefault();
        axiosInstance
            .get(`/books/${bookIdx}/files/download/${file.idx}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}` // JWT 토큰을 인증 헤더에 포함
                }
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.originalFileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => console.error('Error downloading file:', err));
    };

    return (
        <div className="home-page">
            <input type="hidden" id="bookIdx" name="bookIdx" value={book.bookIdx || ''} />
        
            <table className="book_detail">
                <colgroup>
                    <col width="15%" />
                    <col width="*" />
                    <col width="15%" />
                    <col width="35%" />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">표제</th>
                        <td colSpan="3">{book.title}</td>
                    </tr>
                    <tr>
                        <th scope="row">저자</th>
                        <td colSpan="3">{book.author}</td>
                    </tr>
                    <tr>
                        <th scope="row">출판사</th>
                        <td colSpan="3">{book.publisher}</td>
                    </tr>
                    <tr>
                        <th scope="row">출판일</th>
                        <td colSpan="3">{book.publishDate}</td>
                    </tr>
                    <tr>
                        <th scope="row">상세정보</th>
                        <td colSpan="3">{book.description}</td>
                    </tr>
                    <tr>
                        <th scope="row">담당자 / 등록일</th>
                        <td colSpan="3">{book.creatorId} / {formatDate(book.createdDatetime)}</td>
                    </tr>
                    {book.updatorId && book.updatedDatetime && (
                        <tr>
                            <th scope="row">수정자 / 수정일</th>
                            <td colSpan="3">{book.updatorId} / {formatDate(book.updatedDatetime)}</td>
                        </tr>
                    )}
                    {files.length > 0 && (
                        <tr>
                            <th scope="row">첨부파일</th>
                            <td colSpan="3">
                                {files.map((file, index) => (
                                    <div key={index}>
                                        <a href="#" onClick={e => handleDownload(e, file)}>{file.originalFileName}</a>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div>
                <input type="button" id="return" className="btn" value="검색목록" onClick={() => navigate('/search')} />
                {role === 'ROLE_ADMIN' && (
                    <>
                        <input type="button" id="update" className="btn" value="수정하기" onClick={updateButtonClick} />
                        <input type="button" id="delete" className="btn" value="삭제하기" onClick={deleteButtonClick} />
                    </>
                )}
            </div>
        </div>    
    );
}