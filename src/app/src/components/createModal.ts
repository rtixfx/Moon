export const createModal = (title: string, options: any[]) => {
    const div = document.createElement('div');
    div.className = 'modal';
    div.innerHTML = `
            <div class="modal__content">
                <h2 class="modal__content__header">${title}</h2>
                <div class="modal__content__options">
                <button class="modal__content__options__button" onclick="document.querySelector('.modal').style.opacity = '0'; setTimeout(() => document.body.removeChild(document.querySelector('.modal')), 300)">Cancel</button>
                    ${options.map((option: any) => `<button class="modal__content__options__button" onclick="${option.action}" ${Object.keys(option.data).map((key: any) => `data-${key}="${option.data[key]}"`).join('')}>${option.name}</button>`).join('')}
                </div>
            </div>
        `;
    document.body.appendChild(div);
}