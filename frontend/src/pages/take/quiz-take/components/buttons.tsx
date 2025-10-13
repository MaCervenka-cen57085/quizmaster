import type React from 'react'
import { Button, type WithOnClick } from 'pages/components/button'

export const NextButton = ({ onClick }: WithOnClick) => (
    <Button id="next" onClick={onClick}>
        Next Question
    </Button>
)

export const EvaluateButton = ({ onClick }: WithOnClick) => (
    <Button id="evaluate" className="submit-btn-evaluate" onClick={onClick}>
        Evaluate
    </Button>
)
export const BackButton = ({ onClick }: WithOnClick) => (
    <Button id="back" onClick={onClick}>
        Back
    </Button>
)

export const SkipButton = ({ onClick }: WithOnClick) => (
    <Button id="skip" onClick={onClick}>
        Skip
    </Button>
)

export const StartButton = ({ onClick }: WithOnClick) => (
    <Button id="start" type="button" onClick={onClick}>
        Start
    </Button>
)

interface BookmarkButtonProps {
    isBookmarked: boolean
    onClick: () => void
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onClick }) => (
    <Button id="add-question-to-bookmark" type="button" onClick={onClick}>
        {isBookmarked ? 'Unbookmark ⭐' : 'Bookmark ☆'}
    </Button>
)
