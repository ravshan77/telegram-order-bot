const tg = window.Telegram.WebApp;

export function useTelegram() {

    const onClose = () => tg.close()
    const onBackButton = () => tg.BackButton.isVisible = false
    const showAlert = (message) => tg.showAlert(message, [])


    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    };


    // johon aka { id: 913081517 }
    // user: { id: 5886555702 },
    // faruxbek: { id: 1038218818 }

    return {
        // user: { ...tg.initDataUnsafe?.user },
        user: { id: 1038218818 },
        onClose,
        onToggleButton,
        tg,
        onBackButton,
        showAlert,
    };
}