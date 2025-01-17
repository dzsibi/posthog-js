import { PostHog } from 'posthog-core'
import {
    BasicSurveyQuestion,
    LinkSurveyQuestion,
    MultipleSurveyQuestion,
    RatingSurveyQuestion,
    Survey,
    SurveyAppearance,
} from '../posthog-surveys-types'

const posthogLogo =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 50 30" fill="none"><path d="M10.8914 17.2057c-.3685.7371-1.42031.7371-1.78884 0L8.2212 15.443c-.14077-.2815-.14077-.6129 0-.8944l.88136-1.7627c.36853-.7371 1.42034-.7371 1.78884 0l.8814 1.7627c.1407.2815.1407.6129 0 .8944l-.8814 1.7627zM10.8914 27.2028c-.3685.737-1.42031.737-1.78884 0L8.2212 25.44c-.14077-.2815-.14077-.6129 0-.8944l.88136-1.7627c.36853-.7371 1.42034-.7371 1.78884 0l.8814 1.7627c.1407.2815.1407.6129 0 .8944l-.8814 1.7628z" fill="##6A6B69"/><path d="M0 23.4082c0-.8909 1.07714-1.3371 1.70711-.7071l4.58338 4.5834c.62997.63.1838 1.7071-.7071 1.7071H.999999c-.552284 0-.999999-.4477-.999999-1v-4.5834zm0-4.8278c0 .2652.105357.5196.292893.7071l9.411217 9.4112c.18753.1875.44189.2929.70709.2929h5.1692c.8909 0 1.3371-1.0771.7071-1.7071L1.70711 12.7041C1.07714 12.0741 0 12.5203 0 13.4112v5.1692zm0-9.99701c0 .26521.105357.51957.292893.7071L19.7011 28.6987c.1875.1875.4419.2929.7071.2929h5.1692c.8909 0 1.3371-1.0771.7071-1.7071L1.70711 2.70711C1.07715 2.07715 0 2.52331 0 3.41421v5.16918zm9.997 0c0 .26521.1054.51957.2929.7071l17.994 17.99401c.63.63 1.7071.1838 1.7071-.7071v-5.1692c0-.2652-.1054-.5196-.2929-.7071l-17.994-17.994c-.63-.62996-1.7071-.18379-1.7071.70711v5.16918zm11.7041-5.87628c-.63-.62997-1.7071-.1838-1.7071.7071v5.16918c0 .26521.1054.51957.2929.7071l7.997 7.99701c.63.63 1.7071.1838 1.7071-.7071v-5.1692c0-.2652-.1054-.5196-.2929-.7071l-7.997-7.99699z" fill="#6A6B69"/><path d="M42.5248 23.5308l-9.4127-9.4127c-.63-.63-1.7071-.1838-1.7071.7071v13.1664c0 .5523.4477 1 1 1h14.5806c.5523 0 1-.4477 1-1v-1.199c0-.5523-.4496-.9934-.9973-1.0647-1.6807-.2188-3.2528-.9864-4.4635-2.1971zm-6.3213 2.2618c-.8829 0-1.5995-.7166-1.5995-1.5996 0-.8829.7166-1.5995 1.5995-1.5995.883 0 1.5996.7166 1.5996 1.5995 0 .883-.7166 1.5996-1.5996 1.5996z" fill="#6A6B69"/><path d="M0 27.9916c0 .5523.447715 1 1 1h4.58339c.8909 0 1.33707-1.0771.70711-1.7071l-4.58339-4.5834C1.07714 22.0711 0 22.5173 0 23.4082v4.5834zM9.997 10.997L1.70711 2.70711C1.07714 2.07714 0 2.52331 0 3.41421v5.16918c0 .26521.105357.51957.292893.7071L9.997 18.9946V10.997zM1.70711 12.7041C1.07714 12.0741 0 12.5203 0 13.4112v5.1692c0 .2652.105357.5196.292893.7071L9.997 28.9916V20.994l-8.28989-8.2899z" fill="#6A6B69"/><path d="M19.994 11.4112c0-.2652-.1053-.5196-.2929-.7071l-7.997-7.99699c-.6299-.62997-1.70709-.1838-1.70709.7071v5.16918c0 .26521.10539.51957.29289.7071l9.7041 9.70411v-7.5834zM9.99701 28.9916h5.58339c.8909 0 1.3371-1.0771.7071-1.7071L9.99701 20.994v7.9976zM9.99701 10.997v7.5834c0 .2652.10539.5196.29289.7071l9.7041 9.7041v-7.5834c0-.2652-.1053-.5196-.2929-.7071L9.99701 10.997z" fill="#6a6b69"/></svg>'
const satisfiedEmoji =
    '<svg class="emoji-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M626-533q22.5 0 38.25-15.75T680-587q0-22.5-15.75-38.25T626-641q-22.5 0-38.25 15.75T572-587q0 22.5 15.75 38.25T626-533Zm-292 0q22.5 0 38.25-15.75T388-587q0-22.5-15.75-38.25T334-641q-22.5 0-38.25 15.75T280-587q0 22.5 15.75 38.25T334-533Zm146 272q66 0 121.5-35.5T682-393h-52q-23 40-63 61.5T480.5-310q-46.5 0-87-21T331-393h-53q26 61 81 96.5T480-261Zm0 181q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 340q142.375 0 241.188-98.812Q820-337.625 820-480t-98.812-241.188Q622.375-820 480-820t-241.188 98.812Q140-622.375 140-480t98.812 241.188Q337.625-140 480-140Z"/></svg>'
const neutralEmoji =
    '<svg class="emoji-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M626-533q22.5 0 38.25-15.75T680-587q0-22.5-15.75-38.25T626-641q-22.5 0-38.25 15.75T572-587q0 22.5 15.75 38.25T626-533Zm-292 0q22.5 0 38.25-15.75T388-587q0-22.5-15.75-38.25T334-641q-22.5 0-38.25 15.75T280-587q0 22.5 15.75 38.25T334-533Zm20 194h253v-49H354v49ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 340q142.375 0 241.188-98.812Q820-337.625 820-480t-98.812-241.188Q622.375-820 480-820t-241.188 98.812Q140-622.375 140-480t98.812 241.188Q337.625-140 480-140Z"/></svg>'
const dissatisfiedEmoji =
    '<svg class="emoji-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M626-533q22.5 0 38.25-15.75T680-587q0-22.5-15.75-38.25T626-641q-22.5 0-38.25 15.75T572-587q0 22.5 15.75 38.25T626-533Zm-292 0q22.5 0 38.25-15.75T388-587q0-22.5-15.75-38.25T334-641q-22.5 0-38.25 15.75T280-587q0 22.5 15.75 38.25T334-533Zm146.174 116Q413-417 358.5-379.5T278-280h53q22-42 62.173-65t87.5-23Q528-368 567.5-344.5T630-280h52q-25-63-79.826-100-54.826-37-122-37ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 340q142.375 0 241.188-98.812Q820-337.625 820-480t-98.812-241.188Q622.375-820 480-820t-241.188 98.812Q140-622.375 140-480t98.812 241.188Q337.625-140 480-140Z"/></svg>'
const veryDissatisfiedEmoji =
    '<svg class="emoji-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480-417q-67 0-121.5 37.5T278-280h404q-25-63-80-100t-122-37Zm-183-72 50-45 45 45 31-36-45-45 45-45-31-36-45 45-50-45-31 36 45 45-45 45 31 36Zm272 0 44-45 51 45 31-36-45-45 45-45-31-36-51 45-44-45-31 36 44 45-44 45 31 36ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 340q142 0 241-99t99-241q0-142-99-241t-241-99q-142 0-241 99t-99 241q0 142 99 241t241 99Z"/></svg>'
const verySatisfiedEmoji =
    '<svg class="emoji-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M479.504-261Q537-261 585.5-287q48.5-26 78.5-72.4 6-11.6-.75-22.6-6.75-11-20.25-11H316.918Q303-393 296.5-382t-.5 22.6q30 46.4 78.5 72.4 48.5 26 105.004 26ZM347-578l27 27q7.636 8 17.818 8Q402-543 410-551q8-8 8-18t-8-18l-42-42q-8.8-9-20.9-9-12.1 0-21.1 9l-42 42q-8 7.636-8 17.818Q276-559 284-551q8 8 18 8t18-8l27-27Zm267 0 27 27q7.714 8 18 8t18-8q8-7.636 8-17.818Q685-579 677-587l-42-42q-8.8-9-20.9-9-12.1 0-21.1 9l-42 42q-8 7.714-8 18t8 18q7.636 8 17.818 8Q579-543 587-551l27-27ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 340q142.375 0 241.188-98.812Q820-337.625 820-480t-98.812-241.188Q622.375-820 480-820t-241.188 98.812Q140-622.375 140-480t98.812 241.188Q337.625-140 480-140Z"/></svg>'
const cancelSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M291-232.348 232.348-291l189-189-189-189L291-727.652l189 189 189-189L727.652-669l-189 189 189 189L669-232.348l-189-189-189 189Z"/></svg>'

const style = (id: string, appearance: SurveyAppearance | null) => `
    .survey-${id}-form {
        position: fixed;
        bottom: 3vh;
        right: 20px;
        color: black;
        font-weight: normal;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        text-align: left;
        max-width: ${parseInt(appearance?.maxWidth || '320')}px;
        z-index: ${parseInt(appearance?.zIndex || '99999')};
    }
    .form-submit[disabled] {
        opacity: 0.6;
        filter: grayscale(100%);
        cursor: not-allowed;
    }
    .survey-${id}-form {
        flex-direction: column;
        background: ${appearance?.backgroundColor || 'white'};
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        padding-top: 5px;
        box-shadow: -6px 0 16px -8px rgb(0 0 0 / 8%), -9px 0 28px 0 rgb(0 0 0 / 5%), -12px 0 48px 16px rgb(0 0 0 / 3%);
    }
    .survey-${id}-form textarea {
        color: #2d2d2d;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        background: white;
        color: black;
        outline: none;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        border-radius: 6px;
        margin: 0.5rem;        
    }
    .form-submit {
        box-sizing: border-box;
        margin: 0;
        font-family: inherit;
        overflow: visible;
        text-transform: none;
        line-height: 1.5715;
        position: relative;
        display: inline-block;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        user-select: none;
        touch-action: manipulation;
        height: 32px;
        padding: 4px 15px;
        font-size: 14px;
        border-radius: 4px;
        outline: 0;
        background: ${appearance?.submitButtonColor || '#2C2C2C'} !important;
        color: #E5E7E0;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    }
    .form-submit:hover {
        filter: brightness(1.2);
    }
    .form-cancel {
        float: right;
        border: none;
        background: ${appearance?.backgroundColor || 'white'};
        cursor: pointer;
    }
    .bolded { font-weight: 600; }
    .bottom-section {
        padding-bottom: .5rem;
    }
    .buttons {
        display: flex;
        justify-content: center;
    }
    .footer-branding {
        color: #6a6b69;
        font-size: 10.5px;
        padding-top: .5rem;
        text-align: center;
    }
    .survey-${id}-box {
        padding: .5rem 1rem;
        display: flex;
        flex-direction: column;
    }
    .survey-question {
        padding-top: 4px;
        padding-bottom: 4px;
        font-weight: 500;
        color: ${appearance?.textColor || 'black'};
    }
    .question-textarea-wrapper {
        display: flex;
        flex-direction: column;
        padding-bottom: 4px;
    }
    .description {
        font-size: 14px;
        margin-top: .75rem;
        margin-bottom: .75rem;
        color: ${appearance?.descriptionTextColor || '#4b4b52'};
    }
    .ratings-number {
        background-color: ${appearance?.ratingButtonColor || '#e0e2e8'};
        font-size: 14px;
        border-radius: 6px;
        border: 1px solid ${appearance?.ratingButtonColor || '#e0e2e8'};
        padding: 8px;
    }
    .ratings-number:hover {
        cursor: pointer;
        filter: brightness(1.1);
    }
    .rating-options {
        margin-top: .5rem;
    }
    .rating-options-buttons {
        display: flex;
        justify-content: space-evenly;
    }
    .max-numbers {
        min-width: 280px;
    }
    .rating-options-emoji {
        display: flex;
        justify-content: space-evenly;
    }
    .ratings-emoji {
        font-size: 16px;
        background-color: transparent;
        border: none;
    }
    .ratings-emoji:hover {
        cursor: pointer;
    }
    .emoji-svg {
        fill: ${appearance?.ratingButtonColor || 'black'};
    }
    .emoji-svg:hover {
        fill: ${appearance?.ratingButtonHoverColor || 'coral'};
    }
    .rating-text {
        display: flex;
        flex-direction: row;
        font-size: 12px;
        justify-content: space-between;
        margin-top: .5rem;
        margin-bottom: .5rem;
        color: #4b4b52;
    }
    .rating-section {
        margin-bottom: .5rem;
    }
    .multiple-choice-options {
        margin-bottom: .5rem;
        margin-top: .5rem;
        font-size: 14px;
    }
    .multiple-choice-options .choice-option {
        display: flex;
        align-items: center;
        gap: 4px;
        background: #00000003;
        font-size: 14px;
        padding: 10px 20px 10px 15px;
        border: 1px solid #0000000d;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 6px;
    }
    .multiple-choice-options .choice-option:hover {
        background: #0000000a;
    }
    .multiple-choice-options input {
        cursor: pointer;
    }
    .multiple-choice-options label {
        width: 100%;
        cursor: pointer;
    }
    .thank-you-message {
        position: fixed;
        bottom: 8vh;
        right: 20px;
        border-radius: 8px;
        z-index: ${parseInt(appearance?.zIndex || '99999')};
        box-shadow: -6px 0 16px -8px rgb(0 0 0 / 8%), -9px 0 28px 0 rgb(0 0 0 / 5%), -12px 0 48px 16px rgb(0 0 0 / 3%);
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    .thank-you-message-container {
        background: ${appearance?.backgroundColor || 'white'};
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        padding: 12px 18px;
        text-align: center;
        max-width: 320px;
        min-width: 150px;
    }
    .thank-you-message {
        color: ${appearance?.textColor || 'black'};
    }
    .thank-you-message-body {
        padding-bottom: 8px;
        font-size: 14px;
        color: ${appearance?.descriptionTextColor || '#4b4b52'};
    }
    `

export const createShadow = (styleSheet: string, surveyId: string) => {
    const div = document.createElement('div')
    div.className = `PostHogSurvey${surveyId}`
    const shadow = div.attachShadow({ mode: 'open' })
    if (styleSheet) {
        const styleElement = Object.assign(document.createElement('style'), {
            innerText: styleSheet,
        })
        shadow.appendChild(styleElement)
    }
    document.body.appendChild(div)
    return shadow
}

export const closeSurveyPopup = (surveyId: string, surveyPopup: HTMLFormElement) => {
    Object.assign(surveyPopup.style, { display: 'none' })
    localStorage.setItem(`seenSurvey_${surveyId}`, 'true')
    window.setTimeout(() => {
        window.dispatchEvent(new Event('PHSurveyClosed'))
    }, 2000)
    surveyPopup.reset()
}

export const createOpenTextPopup = (posthog: PostHog, survey: Survey) => {
    const question = survey.questions[0] as BasicSurveyQuestion | LinkSurveyQuestion
    const surveyQuestionType = question.type
    const surveyDescription = question.description
    const questionText = question.question
    const form = `
    <div class="survey-${survey.id}-box">
        <div class="cancel-btn-wrapper">
            <button class="form-cancel" type="cancel">${cancelSVG}</button>
        </div>
        <div class="question-textarea-wrapper">
            <div class="survey-question">${questionText}</div>
            ${surveyDescription ? `<span class="description">${surveyDescription}</span>` : ''}
            ${surveyQuestionType === 'open' ? `<textarea class="survey-textarea" name="survey" rows=4></textarea>` : ''}
        </div>
        <div class="bottom-section">
            <div class="buttons">
                <button class="form-submit" type="submit">${survey.appearance?.submitButtonText || 'Submit'}</button>
            </div>
            <div class="footer-branding"><div>powered by ${posthogLogo} PostHog</div></div>
        </div>
    </div>
`
    const formElement = Object.assign(document.createElement('form'), {
        className: `survey-${survey.id}-form`,
        innerHTML: form,
        onsubmit: function (e: any) {
            e.preventDefault()
            const surveyQuestionType = question.type
            posthog.capture('survey sent', {
                $survey_name: survey.name,
                $survey_id: survey.id,
                $survey_question: survey.questions[0],
                $survey_response: surveyQuestionType === 'open' ? e.target.survey.value : 'link clicked',
                sessionRecordingUrl: posthog.get_session_replay_url(),
            })
            if (surveyQuestionType === 'link') {
                window.open(question.link || undefined)
            }
            window.setTimeout(() => {
                window.dispatchEvent(new Event('PHSurveySent'))
            }, 200)
            closeSurveyPopup(survey.id, formElement)
        },
    })

    return formElement
}

export const createThankYouMessage = (survey: Survey) => {
    const thankYouHTML = `
    <div class="thank-you-message-container">
        <h3 class="thank-you-message-header">${survey.appearance?.thankYouMessageHeader || 'Thank you!'}</h3>
        <div class="thank-you-message-body">${survey.appearance?.thankYouMessageDescription || ''}</div>
        ${
            survey.appearance?.whiteLabel
                ? ''
                : `<div class="footer-branding"><div>powered by ${posthogLogo} PostHog</div></div>`
        }
    </div>
    `
    const thankYouElement = Object.assign(document.createElement('div'), {
        className: `thank-you-message`,
        innerHTML: thankYouHTML,
    })
    return thankYouElement
}

export const addCancelListeners = (
    posthog: PostHog,
    surveyPopup: HTMLFormElement,
    surveyId: string,
    surveyEventName: string
) => {
    const cancelButton = surveyPopup.getElementsByClassName('form-cancel')?.[0] as HTMLButtonElement

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault()
        Object.assign(surveyPopup.style, { display: 'none' })
        localStorage.setItem(`seenSurvey_${surveyId}`, 'true')
        posthog.capture('survey dismissed', {
            $survey_name: surveyEventName,
            $survey_id: surveyId,
            sessionRecordingUrl: posthog.get_session_replay_url(),
        })
        window.dispatchEvent(new Event('PHSurveyClosed'))
    })
}

export const createRatingsPopup = (posthog: PostHog, survey: Survey) => {
    const question = survey.questions[0] as RatingSurveyQuestion
    const scale = question.scale
    const displayType = question.display
    const ratingOptionsElement = document.createElement('div')
    if (displayType === 'number') {
        ratingOptionsElement.className = `rating-options-buttons ${scale === 10 ? 'max-numbers' : ''}`
        for (let i = 1; i <= scale; i++) {
            const buttonElement = document.createElement('button')
            buttonElement.className = `ratings-number rating_${i}`
            buttonElement.type = 'submit'
            buttonElement.value = `${i}`
            buttonElement.innerHTML = `${i}`
            ratingOptionsElement.append(buttonElement)
        }
    } else if (displayType === 'emoji') {
        ratingOptionsElement.className = 'rating-options-emoji'
        const threeEmojis = [dissatisfiedEmoji, neutralEmoji, satisfiedEmoji]
        const fiveEmojis = [veryDissatisfiedEmoji, dissatisfiedEmoji, neutralEmoji, satisfiedEmoji, verySatisfiedEmoji]
        for (let i = 1; i <= scale; i++) {
            const emojiElement = document.createElement('button')
            emojiElement.className = `ratings-emoji rating_${i}`
            emojiElement.type = 'submit'
            emojiElement.value = `${i}`
            emojiElement.innerHTML = scale === 3 ? threeEmojis[i - 1] : fiveEmojis[i - 1]
            ratingOptionsElement.append(emojiElement)
        }
    }
    const ratingsForm = `
    <div class="survey-${survey.id}-box">
        <div class="cancel-btn-wrapper">
            <button class="form-cancel" type="cancel">${cancelSVG}</button>
        </div>
        <div class="survey-question">${question.question}</div>
        ${question.description ? `<span class="description">${question.description}</span>` : ''}
        <div class="rating-section">
            <div class="rating-options">
            </div>
            <div class="rating-text">
            <div>${question.lowerBoundLabel || ''}</div>
            <div>${question.upperBoundLabel || ''}</div>
            </div>
            <div class="footer-branding"><div>powered by ${posthogLogo} PostHog</div></div>
        </div>
    </div>
            `
    const formElement = Object.assign(document.createElement('form'), {
        className: `survey-${survey.id}-form`,
        innerHTML: ratingsForm,
    })
    formElement.getElementsByClassName('rating-options')[0].insertAdjacentElement('afterbegin', ratingOptionsElement)
    for (const x of Array(question.scale).keys()) {
        formElement.getElementsByClassName(`rating_${x + 1}`)[0].addEventListener('click', (e: Event) => {
            e.preventDefault()
            posthog.capture('survey sent', {
                $survey_name: survey.name,
                $survey_id: survey.id,
                $survey_question: question.question,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore // TODO: Fix this, error because it doesn't know that the target is a button
                $survey_response: parseInt(e.currentTarget?.value),
                sessionRecordingUrl: posthog.get_session_replay_url(),
            })
            window.setTimeout(() => {
                window.dispatchEvent(new Event('PHSurveySent'))
            }, 200)
            closeSurveyPopup(survey.id, formElement)
        })
    }

    return formElement
}

export const createMultipleChoicePopup = (posthog: PostHog, survey: Survey) => {
    const surveyQuestion = survey.questions[0].question
    const surveyDescription = survey.questions[0].description
    const surveyQuestionChoices = (survey.questions[0] as MultipleSurveyQuestion).choices
    const singleOrMultiSelect = survey.questions[0].type
    const form = `
    <div class="survey-${survey.id}-box">
        <div class="cancel-btn-wrapper">
            <button class="form-cancel" type="cancel">${cancelSVG}</button>
        </div>
        <div class="survey-question">${surveyQuestion}</div>
        ${surveyDescription ? `<span class="description">${surveyDescription}</span>` : ''}
        <div class="multiple-choice-options">
        ${surveyQuestionChoices
            .map((option, idx) => {
                const inputType = singleOrMultiSelect === 'single_choice' ? 'radio' : 'checkbox'
                const singleOrMultiSelectString = `<div class="choice-option"><input type=${inputType} id=surveyQuestionMultipleChoice${idx} name="choice" value="${option}">
            <label for=surveyQuestionMultipleChoice${idx}>${option}</label></div>`
                return singleOrMultiSelectString
            })
            .join(' ')}
        </div>
        <div class="bottom-section">
        <div class="buttons">
            <button class="form-submit" type="submit">${survey.appearance?.submitButtonText || 'Submit'}</button>
        </div>
        <div class="footer-branding"><div>powered by ${posthogLogo} PostHog</div></div>
    </div>

    </div>
    `
    const formElement = Object.assign(document.createElement('form'), {
        className: `survey-${survey.id}-form`,
        innerHTML: form,
        onsubmit: (e: any) => {
            e.preventDefault()
            const selectedChoices =
                singleOrMultiSelect === 'single_choice'
                    ? e.target.querySelector('input[type=radio]:checked').value
                    : [...e.target.querySelectorAll('input[type=checkbox]:checked')].map((choice) => choice.value)
            posthog.capture('survey sent', {
                $survey_name: survey.name,
                $survey_id: survey.id,
                $survey_question: survey.questions[0],
                $survey_response: selectedChoices,
                sessionRecordingUrl: posthog.get_session_replay_url(),
            })
            closeSurveyPopup(survey.id, formElement)
        },
    })
    return formElement
}

export const callSurveys = (posthog: PostHog, forceReload: boolean = false) => {
    posthog?.getActiveMatchingSurveys((surveys) => {
        const nonAPISurveys = surveys.filter((survey) => survey.type !== 'api')
        nonAPISurveys.forEach((survey) => {
            if (document.querySelectorAll("div[class^='PostHogSurvey']").length === 0) {
                const surveyWaitPeriodInDays = survey.conditions?.seenSurveyWaitPeriodInDays
                const lastSeenSurveyDate = localStorage.getItem(`lastSeenSurveyDate`)
                if (surveyWaitPeriodInDays && lastSeenSurveyDate) {
                    const today = new Date()
                    const diff = Math.abs(today.getTime() - new Date(lastSeenSurveyDate).getTime())
                    const diffDaysFromToday = Math.ceil(diff / (1000 * 3600 * 24))
                    if (diffDaysFromToday < surveyWaitPeriodInDays) {
                        return
                    }
                }

                if (!localStorage.getItem(`seenSurvey_${survey.id}`)) {
                    let surveyPopup
                    const surveyQuestionType = survey.questions[0].type
                    if (surveyQuestionType === 'rating') {
                        surveyPopup = createRatingsPopup(posthog, survey)
                    } else if (surveyQuestionType === 'open' || surveyQuestionType === 'link') {
                        surveyPopup = createOpenTextPopup(posthog, survey)
                    } else if (surveyQuestionType === 'single_choice' || surveyQuestionType === 'multiple_choice') {
                        surveyPopup = createMultipleChoicePopup(posthog, survey)
                    }

                    if (!surveyPopup) {
                        console.error(`PostHog: Survey question type: ${surveyQuestionType} not supported`)
                        return
                    }

                    const shadow = createShadow(style(survey.id, survey?.appearance), survey.id)

                    addCancelListeners(posthog, surveyPopup, survey.id, survey.name)
                    if (survey.appearance?.whiteLabel) {
                        ;(
                            surveyPopup.getElementsByClassName('footer-branding') as HTMLCollectionOf<HTMLElement>
                        )[0].style.display = 'none'
                    }
                    shadow.appendChild(surveyPopup)

                    window.dispatchEvent(new Event('PHSurveyShown'))
                    posthog.capture('survey shown', {
                        $survey_name: survey.name,
                        $survey_id: survey.id,
                        sessionRecordingUrl: posthog.get_session_replay_url(),
                    })
                    localStorage.setItem(`lastSeenSurveyDate`, new Date().toISOString())
                    if (survey.appearance?.displayThankYouMessage) {
                        window.addEventListener('PHSurveySent', () => {
                            const thankYouElement = createThankYouMessage(survey)
                            shadow.appendChild(thankYouElement)
                            window.setTimeout(() => {
                                thankYouElement.remove()
                            }, 2000)
                        })
                    }
                }
            }
        })
    }, forceReload)
}

export function generateSurveys(posthog: PostHog) {
    callSurveys(posthog, true)

    let currentUrl = location.href
    if (location.href) {
        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href
                callSurveys(posthog, false)
            }
        }, 1500)
    }
}
