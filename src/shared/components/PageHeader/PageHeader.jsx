import Button from '@/shared/components/Button/Button'
import './PageHeader.css'

export default function PageHeader({
    title,
    buttonText,
    onButtonClick,
    buttonIcon,
    showButton = true,
    children
}) {
    return (
        <header className="page-header">
            <div className="page-header__text">
                <h1 className="page-header__title">{title}</h1>

                {children && (
                    <div className="page-header__subtitle">
                        {children}
                    </div>
                )}
            </div>

            {showButton && buttonText && (
                <Button
                    variant="filled"
                    icon={buttonIcon}
                    onClick={onButtonClick}
                >
                    {buttonText}
                </Button>
            )}
        </header>
    )
}