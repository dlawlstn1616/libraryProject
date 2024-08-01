//첨부파일 수정 기능 X
import { useState, useEffect } from 'react';
import './LibraryRegister.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from './AxiosInstance';

export default function LibraryUpdate() {
    const adminId = localStorage.getItem('creatorId');
    const location = useLocation();
    const { book } = location.state || {};

    const [formData, setFormData] = useState({
        creatorId: book?.creatorId || '',
        title: book?.title || '',
        author: book?.author || '',
        publisher: book?.publisher || '',
        publishDate: book?.publishDate || '',
        description: book?.description || '',
        updatorId: `${adminId}`
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (book) {
            setFormData({
                creatorId: book.creatorId,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                publishDate: book.publishDate,
                description: book.description,
                updatorId: `${adminId}`
            });
        }
    }, [book]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const updateButtonClick = async (e) => {
        e.preventDefault();
        const currentTime = new Date().toISOString();
        const dataToSubmit = {
            ...formData,
            updatedDatetime: `${currentTime}`
        };
        console.log("Submitting form data:", dataToSubmit); // 폼 데이터 로그 출력

        try {
            const response = await axiosInstance.put(`/books/${book.bookIdx}`, dataToSubmit);
            console.log("Response from server:", response); // 서버 응답 로그 출력
            if (response.status === 200) {
                console.log("도서 수정이 성공적으로 완료되었습니다."); // 성공 로그 출력
                alert('도서 수정이 성공적으로 완료되었습니다.');
                navigate('/');
            } else {
                console.log("도서 수정에 실패했습니다. : ", response.data); // 실패 로그 출력
                alert('도서 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('error during update:', error); // 에러 로그 출력
            alert('도서 수정에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="home-page">
                <form id="frm" method="put" onSubmit={updateButtonClick}>
                    <table className="book_register">
                        <colgroup>
                            <col width="15%" />
                            <col width="*" />
                            <col width="15%" />
                            <col width="35%" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">담당자</th>
                                <td colSpan="3">
                                    <p>{formData.creatorId}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">수정자</th>
                                <td colSpan="3">
                                    <p>{adminId}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">제목</th>
                                <td colSpan="3">
                                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">저자</th>
                                <td colSpan="3">
                                    <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">출판사</th>
                                <td colSpan="3">
                                    <input type="text" id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} required />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">출판일</th>
                                <td colSpan="3">
                                    <input type="date" id="publishDate" name="publishDate" value={formData.publishDate} onChange={handleChange} required />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">설명</th>
                                <td colSpan="3">
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="button-container">
                        <button type="submit" className="btn">수정하기</button>
                    </div>
                </form>
            </div>
        </>
    );
}
