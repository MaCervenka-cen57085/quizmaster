interface EasyModeChoiceEditProps {
    readonly isEasyModeChoice: boolean
    readonly setIsEasyModeChoice: (isEasyModeChoice: boolean) => void
}

export const EasyModeChoiceEdit = ({ isEasyModeChoice, setIsEasyModeChoice }: EasyModeChoiceEditProps) => (
    <div>
        <input
            id="is-easy-mode-choice"
            type="checkbox"
            checked={isEasyModeChoice}
            onChange={e => setIsEasyModeChoice(e.target.checked)}
        />
        <label htmlFor="is-easy-mode-choice">Easy mode (quiz taker will see the amount of correct answers for this question)</label>
    </div>
)
