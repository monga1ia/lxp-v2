import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setPerson: "SET_PERSON_INFO",
};

const initState = {
    firstName: null,
    lastName: null,
    avatar: null,
    email: null,
    phone: null,
    isStudent: null,
    isEstudentUser: null,
    isOrganizationUser: null,
    code: null,
    className: null,
};

export const personInfo = persistReducer(
    { storage, key: 'person', whitelist: ['firstName', 'lastName', 'avatar', 'email', 'phone', 'isStudent', 'isEstudentUser', 'isOrganizationUser', 'code', 'className'] }, (state = initState, action) => {
        switch (action.type) {
            case actionTypes.setPerson: {
                return {
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    avatar: action.payload.avatar,
                    email: action.payload.email,
                    phone: action.payload.phone,
                    isStudent: action.payload.isStudent,
                    isEstudentUser: action.payload.isEstudentUser,
                    isOrganizationUser: action.payload.isOrganizationUser,
                    code: action.payload.code,
                    className: action.payload.className,
                };
            }
            default:
                return state;
        }
    }
);

export default personInfo;