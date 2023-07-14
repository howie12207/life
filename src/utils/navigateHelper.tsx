import { NavigateFunction } from 'react-router-dom';

let navigate: NavigateFunction | ((arg0: string) => void);

export function setNavigate(navigateRef: NavigateFunction) {
    navigate = navigateRef;
}

export function navigateTo(path: string) {
    navigate(path);
}
