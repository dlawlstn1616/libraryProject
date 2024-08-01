import { useRef, useState } from 'react';
import './LibraryRegister.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './AxiosInstance';

export default function LibraryRegister() {
    const adminId = localStorage.getItem('creatorId');

    const [formData, setFormData] = useState({
        creatorId: adminId,
        title: '',
        author: '',
        publisher: '',
        publishDate: '',
        description: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 파일 선택창을 직접 제어하기 위해 ref 객체 변수를 정의
    const refFiles = useRef();

    // 업로드할 파일 데이터를 저장할 상태변수와 이벤트 핸들러
    const [files, setFiles] = useState([]);
    const handleChangeFiles = (e) => {
        const selectedFiles = e.target.files;

        if (selectedFiles.length > 3) {
            alert('PDF 파일은 최대 3개까지만 업로드 가능합니다.');
            refFiles.current.value = '';
            setFiles([]);
            return;
        }

        setFiles(Array.from(selectedFiles));
    };

    const addButtonClick = async (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData); // 폼 데이터 로그 출력

        // serverFormData 변수에 서버로 전달할 입력창의 내용을 data 이름으로 설정
        const serverFormData = new FormData();
        serverFormData.append('data', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

        // 첨부 파일을 files 이름으로 추가
        files.forEach(file => serverFormData.append('files', file));

        try {
            const response = await axiosInstance.post('/books/writefiles', serverFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Response from server:", response); // 서버 응답 로그 출력
            if (response.status === 201) {
                console.log("도서 등록이 성공적으로 완료되었습니다."); // 성공 로그 출력
                alert('도서 등록이 성공적으로 완료되었습니다.');
                navigate('/');
            } else {
                console.log("도서 등록에 실패했습니다.:", response.data); // 실패 로그 출력
                alert('도서 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('error during register:', error); // 에러 로그 출력
            alert('도서 등록에 실패했습니다.');
        }
    };

    return (
        <div className="home-page">
            <form id="frm" method="post" onSubmit={addButtonClick}>
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
                <input ref={refFiles} onChange={handleChangeFiles} type="file" id="files" name="files" multiple />
                <div className="button-container">
                    <button type="submit" className="btn">추가하기</button>
                </div>
            </form>
        </div>
    );
}
