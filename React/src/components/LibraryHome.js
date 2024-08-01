import "./LibraryHome.css";
import bookIcon from '../assets/book.PNG';
import { useLocation, useNavigate } from "react-router-dom";

function LibraryHome() {
    const navigate = useNavigate();
    const searchOnclick = () => navigate('/search');
    const registerOnclick = () => navigate('/register');
    const role = localStorage.getItem('role');

    console.log(role);

    return (
        <>
            <div className="home-page">
                {role === 'ROLE_ADMIN' && (
                    <div className="book-actions">
                        <div className="book-action-item" onClick={registerOnclick}>
                            <img src={bookIcon} alt="도서 등록" className="book-icon" />
                            <p className="book-action-text">도서 등록</p>
                        </div>
                        <div className="book-action-item" onClick={searchOnclick}>
                            <img src={bookIcon} alt="도서 검색" className="book-icon" />
                            <p className="book-action-text">도서 검색</p>
                        </div>
                    </div>
                )}
                {role !== 'ROLE_ADMIN' && (
                    <div className="book-actions">
                        <div className="book-action-item" onClick={searchOnclick}>
                            <img src={bookIcon} alt="도서 검색" className="book-icon" />
                            <p className="book-action-text">도서 검색</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default LibraryHome;