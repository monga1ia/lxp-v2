/* eslint-disable */
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import Checkbox from "./Checkbox";
// import { isEqual } from 'lodash';
import Select from './Select';
import DatePicker from "./DatePicker";
import DateTimePickerComp from "./DateTimePicker";
import './form.scss';
import TimePicker from "./TimePicker";
import DatePickerRange from "./DatePickerRange";
import TimePickerRange from "./TimePickerRange";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { SketchPicker } from 'react-color';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import RadioButton from 'components/buttons/RadioButton';
import ContentEditable from 'react-contenteditable';
import { ResizeProvider, ResizeConsumer } from "react-resize-context";
import { NDropdown as Dropdown } from 'widgets/Dropdown';

const Forms = (({
    fields: paramFields = [],
    onSubmit,
    formStyle = {},
}, ref) => {
    const { t } = useTranslation();
    const fileUploaderRef = useRef([]);
    const textRef = useRef([]);
    useImperativeHandle(ref, () => ({
        validate() {
            return validateFields();
        },
        hideMessages,
        updateFields,
        updateChildField,
        getValues,
        getCurrentState() {
            return fields;
        }
    }));

    const [fields, setFields] = useState([]);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [selectedTabType, setSelectedTabType] = useState(null);
    const [size, setSize] = useState({})

    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    useEffect(() => {
        setFields(paramFields)
        // if (paramFields?.length && !isEqual(paramFields, fields)) {
        //     setFields(paramFields);
        // }
    }, []);

    const onInputChange = (e, index, upperCase) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        if (field.key.toLowerCase() === 'code') {
            field.value = upperCase ? e.target.value.toUpperCase().replace(/\s/g, '') : e.target.value.replace(/\s/g, '');
        } else {
            field.value = upperCase ? e.target.value.toUpperCase() : e.target.value;
        }
        clone[index] = field;
        setFields(clone);
    };

    const onEditorChange = (e, data, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = data
        clone[index] = field;
        setFields(clone);
    }

    const onFileInputChange = (e, index) => {
        const clone = [...fields];
        if (e.target.files && e.target.files) {
            let files = e.target.files;
            const verified = verifyFile(files, index);

            if (verified) {
                let fileNames = '';
                for (let i = 0; i < files.length; i++) {
                    if (files.length == 1) {
                        fileNames = files[i].name;
                    } else if (files.length == i + 1) {
                        fileNames = fileNames + files[i].name;
                    } else if (files.length > 1) {
                        fileNames = fileNames + files[i].name + ', ';
                    }
                }
                clone[index].fileNames = fileNames;
                clone[index].showErrorMessage = false;
                clone[index].errorMessage = '';
                clone[index].files = files;
                clone[index].onChange?.(files, e, 'add');
                setFields(clone);
            }
        }
    };

    const onFileUploadButtonHandler = (index) => {
        if (fileUploaderRef && fileUploaderRef.current[index]) {
            fileUploaderRef.current[index].click();
        }
    };

    const onFileUploadClearButtonHandler = (index) => {
        const clone = [...fields];
        clone[index].files = null;
        clone[index].fileNames = '';
        clone[index].onChange?.(null, null, 'clear');
        setFields(clone);
    };

    const verifyFile = (files, index) => {
        const clone = [...fields];
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            'video/x-ms-wmv',
            'application/pdf',
            'audio/mpeg',
            'video/mpeg',
            'video/mp4',
            'video/quicktime',
            'video/x-ms-wmv',
        ];
        const acceptedSize = 20 * 52428800;

        if (files && files.length > 0) {
            let isFalse = true;
            for (let i = 0; i < files.length; i++) {
                let imageSize = files[i].size;
                let imageType = files[i].type;
                if (imageSize > acceptedSize) {
                    clone[index].showErrorMessage = true;
                    clone[index].errorMessage = t('newsfeed.fileSizeWarning');
                    setFields(clone);
                    isFalse = false;
                }

                if (!acceptedType.includes(imageType)) {
                    clone[index].showErrorMessage = true;
                    clone[index].errorMessage = t('newsfeed.imageTypeError');
                    setFields(clone);
                    isFalse = false;

                    if(clone[index].accept == "image/*"){
                        clone[index].showErrorMessage = true;
                        clone[index].errorMessage = t('newsfeed.imageTypeImageError');
                        setFields(clone);
                        isFalse = false;
                    }
    
                    if(clone[index].accept == ".mp4,video/*"){
                        clone[index].showErrorMessage = true;
                        clone[index].errorMessage = t('newsfeed.imageTypeVideoError');
                        setFields(clone);
                        isFalse = false;
                    }    
                }
            }
            return isFalse;
        }
    };

    const validateFields = () => {
        let allValid = true;
        const clone = [...fields];
        for (let i = 0; i < fields.length; i++) {
            const field = { ...clone[i] };
            if (field.required) {
                if (field.validation && typeof field.validation === 'function') {
                    const { valid, message } = field.validation(field.value, clone, getValues());
                    if (valid) {
                        if (message) {
                            field.showSuccessMessage = true;
                            field.successMessage = message;
                        }
                    } else {
                        allValid = false;
                        field.showErrorMessage = true;

                        if (message) {
                            field.customErrorMessage = message;
                        }
                    }
                } else if (!field.value || (field.value.constructor === Array && field.value.length === 0)) {
                    allValid = false;
                    field.showErrorMessage = true;
                } else if (field.validValue && field.validValue.constructor === Array && field.validValue.length > 0) {
                    let keys = Object.keys(field.validValue[0]);
                    if (keys && keys.length > 0) {
                        let maxVal = 0;
                        let minVal = 0;
                        for (let i = 0; i < keys.length; i++) {
                            if (keys[i] == 'min') {
                                minVal = field.validValue[0][keys[i]];
                            } else if (keys[i] == 'max') {
                                maxVal = field.validValue[0][keys[i]];
                            }
                        }

                        if (minVal >= parseInt(field.value) || maxVal < parseInt(field.value)) {
                            allValid = false;
                            field.showErrorMessage = true;
                        } else {
                            field.showErrorMessage = false;
                        }
                    }
                } else if (parseInt(field.validValue) == parseInt(field.value)) {
                    allValid = false;
                    field.showErrorMessage = true;
                } else if (field.value) {
                    field.showErrorMessage = false;
                }
            }
            clone[i] = field;
        }
        setFields(clone);
        return [allValid, clone, getValues()];
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit?.();
        // validateFields();
    };

    const handleDropdownChange = (value, evt, index, fieldOption) => {
        // let option = [];
        // let options = fieldOption.options;
        // if (options && options.length > 0) {
        //     for (let i = 0; i < options.length; i++) {
        //         if (value == options[i].value) {
        //             option = options[i]
        //         }
        //     }
        // }
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = evt.value;
        clone[index] = field;
        setFields(clone);
        // field?.onChange?.(value, option);
    };

    const handleExtendedButtonChange = (index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field?.onExtendedButtonChange?.('click');
    };

    const handleCheckboxClick = (checked, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = !checked;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(!checked);
    };

    const getValues = () => {
        const object = {};
        for (const field of fields) {
            if (field.key && !object.hasOwnProperty(field.key)) {
                object[field.key] = field.value;
            }
        }
        return object;
    };

    const hideMessages = () => {

    };

    const updateFields = newFields => {
        setFields(newFields);
    };

    const updateChildField = (options, parentFieldName, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };

        if (options && options.length > 0) {
            for (let i = 0; i < options.length; i++) {
                if (parentFieldName === options[i].name) {
                    clone[index] = options[i];
                    setFields(clone);
                }
            }
        }
    };

    const handleDateChange = (value, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = value;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(value);
    };

    const handleDateTimeChange = (value, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = value;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(value);
    };

    const handleTimeChange = (value, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = value;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(value);
    };

    const handerRangePicker = (dates, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = dates;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(dates);
    };

    const handleColorChange = (color, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = color.hex;
        clone[index] = field;
        setFields(clone);
        field?.onChange?.(values.hex);
    };

    const handleDisplayColorPicker = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleCloseColorPicker = () => {
        setDisplayColorPicker(false);
    };

    const onSelectTab = (type, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        field.value = '';
        field.selectedType = type;
        clone[index] = field;
        setFields(clone);
        setSelectedTabType(type)
    }

    const handlerCopyValue = (value, index) => {
        const clone = [...fields];
        const field = { ...clone[index] };
        
        field.value = value;

        clone[index] = field;
        setFields(clone);
    }

    const onKeyDown = (e, index) => {
        let lastValue = textRef?.current[index]?.lastHtml
        // let lastValue = textRef?.current.lastHtml
        let valueArray = lastValue.split(/<div ?\/?>/)

        if(e.shiftKey && e.which == 65) {
            let updatedValue = ''
            if(valueArray && valueArray.length > 1){
                let lastArrayValue = valueArray[valueArray.length - 1]
                var textValueArray = lastArrayValue.split('</div>');

                for(let i = 0; i < valueArray.length - 1; i++){
                    updatedValue += '<div>' + valueArray[i]
                }
                updatedValue += '<div>' + textValueArray[0] + '\u202F' + textValueArray[1];
            } else {
                updatedValue = lastValue + '\u202F'
            }

            const clone = [...fields];
            const field = { ...clone[index] };
            
            field.value = updatedValue;

            clone[index] = field;
            setFields(clone);
            e.preventDefault();
            e.stopPropagation();
        }

        if(e.shiftKey && e.which == 71) {
            let updatedValue = ''
            if(valueArray && valueArray.length > 1){
                let lastArrayValue = valueArray[valueArray.length - 1]
                var textValueArray = lastArrayValue.split('</div>');

                for(let i = 0; i < valueArray.length - 1; i++){
                    updatedValue += '<div>' + valueArray[i]
                }
                updatedValue += '<div>' + textValueArray[0] + '\u180E' + textValueArray[1];
            } else {
                updatedValue = lastValue + '\u180E'
            }

            const clone = [...fields];
            const field = { ...clone[index] };
            
            field.value = updatedValue;

            clone[index] = field;
            setFields(clone);
            e.preventDefault();
            e.stopPropagation();
        }

        if(e.shiftKey && (e.which == 48 || e.which == 49 || e.which == 50 || e.which == 51 || e.which == 52 || e.which == 53 || e.which == 54 || e.which == 55 || e.which == 56 || e.which == 57)) {
            let updatedValue = ''
            if(valueArray && valueArray.length > 1){
                let lastArrayValue = valueArray[valueArray.length - 1]
                var textValueArray = lastArrayValue.split('</div>');

                for(let i = 0; i < valueArray.length - 1; i++){
                    updatedValue += '<div>' + valueArray[i]
                }

                if(e.which == 48){
                    updatedValue += '<div>' + textValueArray[0] + '\u1810' + textValueArray[1];
                } else if(e.which == 49){
                    updatedValue += '<div>' + textValueArray[0] + '\u1811' + textValueArray[1];
                } else if(e.which == 50){
                    updatedValue += '<div>' + textValueArray[0] + '\u1812' + textValueArray[1];
                } else if(e.which == 51){
                    updatedValue += '<div>' + textValueArray[0] + '\u1813' + textValueArray[1];
                } else if(e.which == 52){
                    updatedValue += '<div>' + textValueArray[0] + '\u1814' + textValueArray[1];
                } else if(e.which == 53){
                    updatedValue += '<div>' + textValueArray[0] + '\u1815' + textValueArray[1];
                } else if(e.which == 54){
                    updatedValue += '<div>' + textValueArray[0] + '\u1816' + textValueArray[1];
                } else if(e.which == 55){
                    updatedValue += '<div>' + textValueArray[0] + '\u1817' + textValueArray[1];
                } else if(e.which == 56){
                    updatedValue += '<div>' + textValueArray[0] + '\u1818' + textValueArray[1];
                } else if(e.which == 57){
                    updatedValue += '<div>' + textValueArray[0] + '\u1819' + textValueArray[1];
                }
            } else {
                // 0
                if(e.which == 48){
                    updatedValue = lastValue + '\u1810'
                } 
                // 1
                else if(e.which == 49){
                    updatedValue = lastValue + '\u1811'
                } 
                // 2
                else if(e.which == 50){
                    updatedValue = lastValue + '\u1812'
                } 
                // 3
                else if(e.which == 51){
                    updatedValue = lastValue + '\u1813'
                }
                // 4
                else if(e.which == 52){
                    updatedValue = lastValue + '\u1814'
                } 
                // 5
                else if(e.which == 53){
                    updatedValue = lastValue + '\u1815'
                } 
                // 6
                else if(e.which == 54){
                    updatedValue = lastValue + '\u1816'
                } 
                // 7
                else if(e.which == 55){
                    updatedValue = lastValue + '\u1817'
                }
                // 8 
                else if(e.which == 56){
                    updatedValue = lastValue + '\u1818'
                }
                // 9
                else if(e.which == 57){
                    updatedValue = lastValue + '\u1819'
                }
            }

            const clone = [...fields];
            const field = { ...clone[index] };
            
            field.value = updatedValue;

            clone[index] = field;
            setFields(clone);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    const renderTab = (field, index, type) => {
        if(field.selectedType == 'editor' || (!field.selectedType && field?.defaultType == 'editor')){
            if(!field.selectedType){
                field.selectedType = field?.defaultType
            }
            return (
                <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    config={{
                        placeholder: field.placeholder || '',
                        width: '100%',
                        toolbar: {
                            items: [
                                'heading',
                                'MathType',
                                'ChemType',
                                '|',
                                'bold',
                                'italic',
                                'link',
                                'bulletedList',
                                'numberedList',
                                'insertTable',
                                'blockQuote',
                                'undo',
                                'redo',
                            ],
                        },
                    }}
                    style={field.style}
                    onChange={(e, editor) => {
                        const data = editor.getData();

                        onEditorChange(e, data, index)
                    }}
                />
            )
        } if(field.selectedType == 'traditionalMb' || (!field.selectedType && field?.defaultType == 'traditionalMb')){
            if(!field.selectedType){
                field.selectedType = field?.defaultType
            }
            return (
                <div>
                    <ResizeProvider>
                        <ResizeConsumer
                            className="resize-container mb-1"
                            // onSizeChanged={handleSizeChanged}
                            // updateDatasetBySize={getDatasetBySize}
                            style={{width: 538}}
                        >
                            <ContentEditable
                                ref={el => textRef.current[index] = el}
                                className={'tradition-text'}
                                html={field.value}
                                // value={field.value}
                                style={field.style}
                                disabled={false}
                                onChange={(e) => {
                                    field?.onChange?.(e, field);
                                    onInputChange(e, index);
                                }}
                                onKeyDown={(e) => {
                                    onKeyDown(e, index)
                                }}
                                tagName='article'
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const text = e.clipboardData.getData('text/plain');
                                    const value = field.value ? `${field.value}${text}` : text;
                                    handlerCopyValue(value, index)
                                }}
                            />
                        </ResizeConsumer>
                    </ResizeProvider>
                    <div style={{fontSize: 12}}>
                        <div>Үгийн орхиц "а" үсэг оруулахдаа "shift + a" дараад дахин "a" үсэг дарна</div>
                        <div>Үгийн адагт ордог "г", "н"  үсэг оруулахдаа "shift + g" дараад орхиц "а" үсэг оруулах бол "а" үсэг дахин дарна</div>
                        <div>Тоо оруулах бол "shift" + "тоогоо" оруулна уу</div>
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <div>
            <form style={formStyle} ref={ref} onSubmit={handleSubmit}>
                {
                    fields.map((field, index) => {
                        let className = field.type === 'dropdown' ? '' : 'form-control';
                        if (field.inputClassName) {
                            className += ' ' + field.inputClassName
                        }
                        // let placeholder = '-' + t('select') + '-'
                        // if (field.placeholder) {
                        //     placeholder = field.placeholder
                        // }
                        let message = '';
                        let feedbackClassName = '';
                        let labelClassName = 'col-form-label '
                        let whiteSpaceClassName = ''
                        let formContainerClassName = ''
                        let fieldContainerClassName = 'col-form-field-container '
                        if (field.labelClassName) {
                            labelClassName = labelClassName + field.labelClassName
                        }
                        if (field.whiteSpaceClassName) {
                            whiteSpaceClassName = field.whiteSpaceClassName
                        }
                        if (field.formContainerClassName) {
                            formContainerClassName = field.formContainerClassName
                        }
                        if (field.fieldContainerClassName) {
                            fieldContainerClassName = fieldContainerClassName + field.fieldContainerClassName
                        }
                        if (field.showSuccessMessage && field.successMessage) {
                            className = `${className} is-valid`;
                            message = field.successMessage;
                            feedbackClassName = 'valid-feedback';
                        } else if (field.showErrorMessage) {
                            feedbackClassName = 'invalid-feedback';
                            if (field.customErrorMessage) {
                                message = field.customErrorMessage
                            } else if (field.errorMessage) {
                                message = field.errorMessage;
                            }/* else {
                                message = 'Алдаа гарлаа';
                            }*/
                            className = `${className} is-invalid`;
                        }
                        if (field.type === 'jsx') {
                            if (field.value) {
                                if (React.isValidElement(field.value)) {
                                    if (!field.value.key) {
                                        console.error('Please provide key to Value React element.')
                                    }
                                    if (field.hidden) {
                                        return null;
                                    } else {
                                        return field.value;
                                    }
                                } else {
                                    console.error('Value must be valid React element.');
                                    return null;
                                }
                            } else {
                                console.error('Make sure you provide value.');
                                return null;
                            }
                        }
                        if (field.type === 'text') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={
                                                field.align == 'left'
                                                    ?
                                                    {
                                                        display: 'flex',
                                                        alignItems: field.alignItems ? field.alignItems : 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        justifyContent: 'flex-end',
                                                        ...field.labelStyle
                                                    }
                                                    :
                                                    {
                                                        display: 'flex',
                                                        flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: field.alignItems ? field.alignItems : 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        ...field.labelStyle
                                                    }
                                            }
                                            className={labelClassName}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                            className={fieldContainerClassName}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='text'
                                                placeholder={field?.placeholder || t('field.enterValue')}
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                                style={field.inputStyle}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    className={whiteSpaceClassName}
                                                    // style={{
                                                    //     display: 'flex',
                                                    //     flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                    //     flexDirection: 'column',
                                                    //     marginLeft: 10,
                                                    //     width: field?.inputWidth || 'auto',
                                                    // }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'password') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={
                                                field.align == 'left'
                                                    ?
                                                    {
                                                        display: 'flex',
                                                        alignItems: field.alignItems ? field.alignItems : 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        justifyContent: 'flex-end',
                                                        ...field.labelStyle
                                                    }
                                                    :
                                                    {
                                                        display: 'flex',
                                                        flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                        justifyContent: 'flex-end',
                                                        alignItems: field.alignItems ? field.alignItems : 'center',
                                                        marginRight: 10,
                                                        marginBottom: 0,
                                                        width: field?.labelWidth || 'auto',
                                                        ...field.labelStyle
                                                    }
                                            }
                                            className={labelClassName}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                            //     flexDirection: 'column',
                                            //     marginLeft: 10,
                                            //     width: field?.inputWidth || 'auto',
                                            // }}
                                            className={fieldContainerClassName}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                placeholder={field.placeholder || t('field.enterPassword')}
                                                type='password'
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                                style={field.inputStyle}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    // style={{
                                                    //     display: 'flex',
                                                    //     flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                    //     flexDirection: 'column',
                                                    //     marginLeft: 10,
                                                    //     width: field?.inputWidth || 'auto',
                                                    // }}
                                                    className={whiteSpaceClassName}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'inputGroup') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div className="form-input-group input-group" key={index} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            className='input-group'
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <span className="input-group-text">{field.groupLeftText}</span>
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='text'
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                            />
                                            <span className="input-group-text">{field.groupRightText}</span>
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'number') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                    <label
                                        style={{
                                            display: 'flex',
                                            flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            justifyContent: 'flex-end',
                                            alignItems: field.alignItems ? field.alignItems : 'center',
                                            marginRight: 10,
                                            marginBottom: 0,
                                            width: field?.labelWidth || 'auto',
                                            ...field.labelStyle
                                        }}
                                        className={labelClassName}
                                    >
                                        {field.label}
                                    </label>
                                    <div
                                        // style={{
                                        //     display: 'flex',
                                        //     flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                        //     flexDirection: 'column',
                                        //     marginLeft: 10,
                                        //     width: field?.inputWidth || 'auto',
                                        // }}
                                        className={fieldContainerClassName}
                                    >
                                        <input
                                            disabled={!!field.disabled}
                                            className={className}
                                            placeholder={field.placeholder || t('field.enterValue')}
                                            type='number'
                                            onChange={(e) => {
                                                field?.onChange?.(e, field);
                                                onInputChange(e, index);
                                            }}
                                            value={field.value}
                                        />
                                        <div className={feedbackClassName}>
                                            {message}
                                        </div>
                                    </div>
                                    {
                                        field.inputWidth
                                            ?
                                            null
                                            :
                                            <div
                                                className={whiteSpaceClassName}
                                                // style={{
                                                //     display: 'flex',
                                                //     flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                //     flexDirection: 'column',
                                                //     marginLeft: 10,
                                                //     width: field?.inputWidth || 'auto',
                                                // }}
                                            />
                                    }
                                </div>
                            )
                        }
                        if (field.type === 'numberOnly') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                type='number'
                                                onChange={(e) => {
                                                    const re = /^[0-9\b]+$/;
                                                    if (e.target.value === '' || re.test(e.target.value)) {
                                                        field?.onChange?.(e, field);
                                                        onInputChange(e, index);
                                                    }
                                                }}
                                                value={field.value}
                                                inputMode='numeric'
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'tableCell') {
                            return (
                                <td key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                            flexDirection: 'column',
                                            marginLeft: 10,
                                            width: field?.inputWidth || 'auto',
                                        }}
                                    >
                                        <Dropdown
                                            className={className}
                                            onChange={(value, evt) => handleDropdownChange(value, evt, index, field)}
                                            value={field.value}
                                            style={{width: field?.inputWidth}}
                                            upward={false}
                                            disabled={!!field.disabled}
                                            fluid
                                            closeOnChange
                                            selection
                                            placeholder={field.placeholder || '-' + t('select') + '-'}
                                            selectOnBlur={false}
                                            additionPosition='bottom'
                                            multiple={!!field.multiple}
                                            searchable={!!field.searchable}
                                            clearable={!!field.clearable}
                                            options={field.options}
                                        />
                                        <div style={{ display: 'block' }} className={feedbackClassName}>
                                            {message}
                                        </div>
                                    </div>
                                    {
                                        field.inputWidth
                                            ?
                                            null
                                            :
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                    flexDirection: 'column',
                                                    marginLeft: 10,
                                                    width: field?.inputWidth || 'auto',
                                                }}
                                            />
                                    }
                                </td>
                            )
                        }
                        if (field.type === 'nonCryllic') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: field.alignItems ? field.alignItems : 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                ...field.labelStyle
                                            }}
                                            className={labelClassName}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                            //     flexDirection: 'column',
                                            //     marginLeft: 10,
                                            //     width: field?.inputWidth || 'auto',
                                            // }}
                                            className={fieldContainerClassName}
                                        >
                                            <input
                                                disabled={!!field.disabled}
                                                className={className}
                                                placeholder={field.placeholder || t('field.enterValue')}
                                                type='text'
                                                onChange={(e) => {
                                                    const re = /[А-Яа-яЁёӨөҮү№₮]/;
                                                    if (e.target.value === '' || !re.test(e.target.value)) {
                                                        onInputChange(e, index, field.upperCase = true);
                                                        field?.onChange?.(e, field);
                                                    }
                                                }}
                                                value={field.value}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    className={whiteSpaceClassName}
                                                    // style={{
                                                    //     display: 'flex',
                                                    //     flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                    //     flexDirection: 'column',
                                                    //     marginLeft: 10,
                                                    //     width: field?.inputWidth || 'auto',
                                                    // }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'fileUpload') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                            }}
                                        >
                                            {
                                                field?.path
                                                ?
                                                    field?.pathType == 'image'
                                                    ?
                                                        <img className='eschool-image' src={field?.path} style={field?.pathStyle}/>
                                                    :
                                                    field?.pathType == 'video'
                                                    ?
                                                        <div className='col d-flex justify-content-center'>
                                                            {
                                                                field?.isPlayable
                                                                ?
                                                                    <iframe
                                                                        src={`https://player.vimeo.com/video/${field?.path.split('/').at(-1)}`}
                                                                        width={field?.pathWidth}
                                                                        height="300"
                                                                        allow="autoplay; fullscreen; picture-in-picture"
                                                                        title="Untitled"
                                                                    />
                                                                :
                                                                    <div className='black-color fs-20 d-flex align-items-center justify-content-center' style={{height: 300, width: field?.pathWidth}}>{t('onlineLesson.videoInTranscode')}</div>
                                                            }
                                                        </div>
                                                    : 
                                                        null
                                                :
                                                    <>
                                                        <input
                                                            ref={el => fileUploaderRef.current[index] = el}
                                                            style={{ display: 'none' }}
                                                            type='file'
                                                            accept={field.accept}
                                                            multiple={field.multiple}
                                                            placeholder={'Файл оруулна уу'}
                                                            onChange={(e) => {
                                                                onFileInputChange(e, index, field.upperCase = true);
                                                            }}
                                                            value={field.value}
                                                        />
                                                        <input
                                                            disabled={true}
                                                            className={className}
                                                            value={field.fileNames}
                                                        />
                                                        {
                                                            field.showErrorMessage
                                                                ?
                                                                <div style={{ color: '#F64E60' }}>
                                                                    {field.errorMessage}
                                                                </div>
                                                                : null
                                                        }
                                                    </>
                                            }
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        flexWrap: 'wrap',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {
                                                        field.isExtendedButton
                                                            ?
                                                            <button className={field.isExtendedButtonClass} style={field.isExtendedButtonStyle} onClick={() => onFileUploadButtonHandler(index)}>{field?.isExtendedButtonText || ''}</button>
                                                            : null
                                                    }
                                                    {
                                                        field.clearButton
                                                            ?
                                                            field.fileNames &&
                                                            <Button onClick={() => { onFileUploadClearButtonHandler(index) }} className="btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28 ms-2" style={field.clearButtonStyle}>
                                                                <i className="flaticon2-cross"> </i>
                                                            </Button>
                                                            : null
                                                    }
                                                </div>
                                        }
                                    </div>
                            )
                        }

                        if (field.type === 'nDropdown') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: field.alignItems ? field.alignItems : 'center',
                                                marginRight: 10,
                                                // marginTop: '1rem',
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                ...field.labelStyle,
                                            }}
                                            className= {labelClassName}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                            //     flexDirection: 'column',
                                            //     marginLeft: 10,
                                            //     width: field?.inputWidth || 'auto',
                                            // }}
                                            className={fieldContainerClassName}
                                        >
                                            <Dropdown
                                                className={className}
                                                onChange={(value, evt) => handleDropdownChange(value, evt, index, field)}
                                                value={field.value}
                                                style={{width: field?.inputWidth}}
                                                upward={false}
                                                disabled={!!field.disabled}
                                                fluid
                                                closeOnChange
                                                selection
                                                placeholder={field.placeholder || '-' + t('select') + '-'}
                                                selectOnBlur={false}
                                                additionPosition='bottom'
                                                multiple={!!field.multiple}
                                                searchable={!!field.searchable}
                                                clearable={!!field.clearable}
                                                options={field.options}
                                            />
                                            <div style={{ display: 'block' }} className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.isExtendedButton
                                                ?
                                                <button className={field.isExtendedButtonClass} style={field.isExtendedButtonStyle} onClick={() => handleExtendedButtonChange(index)}>Цэвэрлэх</button>
                                                : null
                                        }
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    className='whiteSpaceClassName'
                                                    // style={{
                                                    //     display: 'flex',
                                                    //     flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                    //     flexDirection: 'column',
                                                    //     marginLeft: 10,
                                                    //     width: field?.inputWidth || 'auto',
                                                    // }}
                                                />
                                        }
                                    </div>
                            )
                        }

                        if (field.type === 'dropdown') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: field.alignItems ? field.alignItems : 'center',
                                                marginRight: 10,
                                                // marginTop: '1rem',
                                                marginBottom: 0,
                                                width: field?.labelWidth || 'auto',
                                                ...field.labelStyle,
                                            }}
                                            className= {labelClassName}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                            //     flexDirection: 'column',
                                            //     marginLeft: 10,
                                            //     width: field?.inputWidth || 'auto',
                                            // }}
                                            className={fieldContainerClassName}
                                        >
                                            <Select
                                                className={className}
                                                onChange={(value, evt) => handleDropdownChange(value, evt, index, field)}
                                                value={field.value}
                                                multiple={!!field.multiple}
                                                searchable={!!field.searchable}
                                                disabled={!!field.disabled}
                                                clearable={!!field.clearable}
                                                options={field.options}
                                            />
                                            <div style={{ display: 'block' }} className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.isExtendedButton
                                                ?
                                                <button className={field.isExtendedButtonClass} style={field.isExtendedButtonStyle} onClick={() => handleExtendedButtonChange(index)}>Цэвэрлэх</button>
                                                : null
                                        }
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    className='whiteSpaceClassName'
                                                    // style={{
                                                    //     display: 'flex',
                                                    //     flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                    //     flexDirection: 'column',
                                                    //     marginLeft: 10,
                                                    //     width: field?.inputWidth || 'auto',
                                                    // }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'checkbox') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} style={{ display: 'flex', marginTop: '1rem' }}>
                                        <label
                                            style={{
                                                display: 'flex',
                                                flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                justifyContent: 'flex-end',
                                                alignItems: field.alignItems ? field.alignItems : 'center',
                                                marginRight: 10,
                                                width: field?.labelWidth || 'auto',
                                                ...field.labelStyle
                                                // marginTop: '1rem',
                                                // marginBottom: 0,
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            {
                                                field.buttonType == 'radio'
                                                    ?
                                                    <div className='d-flex flex-row align-item-center' onClick={() => handleCheckboxClick(field.value, index)}>
                                                        <RadioButton className='mr-3' checked={!!field.value} onChange={() => handleCheckboxClick(field.value, index)} />
                                                        <div className='d-flex flex-column align-items-center justify-content-center'>
                                                            <label>{field.label}</label>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Checkbox
                                                        className='custom-cbox eschool-checkbox'
                                                        checked={!!field.value}
                                                        onChange={() => handleCheckboxClick(!!field.value, index)}
                                                        label={field.label}
                                                        disabled={!!field.disabled}
                                                    />
                                            }
                                            <div style={{ display: 'block' }} className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'date') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <DatePicker
                                                buttonClassName={`eschool-form-date-picker ${className}`}
                                                value={field.value}
                                                onChange={date => handleDateChange(date, index)}
                                                isCustomButton={field?.dateCustomButton}
                                                includeDates={field.includeDays ? field.includeDays : false}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'datetime') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <DateTimePickerComp
                                                value={field.value}
                                                onChange={date => handleDateTimeChange(date, index)}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'time') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <TimePicker
                                                allowInput={!!field.allowTimeInput}
                                                inputClassName={className}
                                                minStep={5}
                                                value={field.value}
                                                onChange={(val) => handleTimeChange(val, index)}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'daterange') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <DatePickerRange
                                                onChange={(val) => handerRangePicker(val, index)}
                                                firstPlaceHolder={field?.firstPlaceHolder}
                                                lastPlaceHolder={field?.lastPlaceHolder}
                                                selectedStartDate={field?.selectedStartDate}
                                                selectedEndDate={field?.selectedEndDate}
                                                showTimeInput={field?.showTimeInput}
                                                showTimeSelect={field?.showTimeSelect}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'timerange') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <TimePickerRange
                                                onChange={(val) => handerRangePicker(val, index)}
                                                selectedStartTime={field?.selectedStartTime}
                                                selectedEndTime={field?.selectedEndTime}
                                            />
                                            <div className={feedbackClassName} style={{ display: message ? 'block' : undefined }}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'textArea') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}
                                        >
                                            <textarea
                                                disabled={!!field.disabled}
                                                className={className}
                                                rows={field.rows}
                                                onChange={(e) => {
                                                    field?.onChange?.(e, field);
                                                    onInputChange(e, index);
                                                }}
                                                value={field.value}
                                                style={field.style}
                                            />
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'richEditor') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                                zIndex: 0
                                            }}
                                        >
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={field.value}
                                                config={{
                                                    placeholder: field.placeholder || '',
                                                    width: '100%',
                                                    toolbar: {
                                                        items: [
                                                            'heading',
                                                            'MathType',
                                                            'ChemType',
                                                            '|',
                                                            'bold',
                                                            'italic',
                                                            'link',
                                                            'bulletedList',
                                                            'numberedList',
                                                            'insertTable',
                                                            'blockQuote',
                                                            'undo',
                                                            'redo',
                                                        ],
                                                    },
                                                }}
                                                style={field.style}
                                                onChange={(e, editor) => {
                                                    const data = editor.getData();

                                                    onEditorChange(e, data, index)
                                                }}
                                            />
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        if (field.type === 'tab') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index}>
                                        <div className='d-flex justify-content-center mb-3 mt-3'>
                                            {
                                                field.isTab && field.tabs && field.tabs.length > 0 &&
                                                    <div className="register-tab-container d-flex">
                                                        {
                                                            field.tabs.map((tab, tIndex) => {
                                                                return (
                                                                    <span
                                                                        key={'form_tab_' + tIndex}
                                                                        onClick={() => {
                                                                            onSelectTab(tab.type, index)
                                                                        }}
                                                                        className={`tab cursor-pointer ${field.selectedType && field.selectedType === tab.type ? "active" : (!field.selectedType && field.defaultType && field.defaultType == tab.type ? "active" : "")}`}
                                                                    >
                                                                        {tab.label}
                                                                    </span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                            }
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '0.8rem' }}>
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                                    justifyContent: 'flex-end',
                                                    alignItems: field.alignItems ? field.alignItems : 'center',
                                                    marginRight: 10,
                                                    marginBottom: 0,
                                                    width: field?.labelWidth || 'auto',
                                                    ...field.labelStyle
                                                }}
                                            >
                                                {field.label}
                                            </label>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                    flexDirection: 'column',
                                                    marginLeft: 10,
                                                    width: field?.inputWidth || 'auto',
                                                    zIndex: 0
                                                }}
                                            >
                                                {renderTab(field, index, selectedTabType)}
                                            </div>
                                            {
                                                field.inputWidth
                                                    ?
                                                    null
                                                    :
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                            flexDirection: 'column',
                                                            marginLeft: 10,
                                                            width: field?.inputWidth || 'auto',
                                                        }}
                                                    />
                                            }
                                        </div>
                                    </div>
                            )
                        }
                        if (field.type === 'colorPicker') {
                            return (
                                field.hidden
                                    ?
                                    <div key={index} />
                                    :
                                    <div key={index} className={formContainerClassName} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                        <label
                                            // style={{
                                            //     display: 'flex',
                                            //     flex: field.labelWidth ? undefined : field?.labelFlex || 1,
                                            //     justifyContent: 'flex-end',
                                            //     alignItems: field.alignItems ? field.alignItems : 'center',
                                            //     marginRight: 10,
                                            //     marginBottom: 0,
                                            //     width: field?.labelWidth || 'auto',
                                            //     ...field.labelStyle
                                            // }}
                                        >
                                            {field.label}
                                        </label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: field.inputWidth ? undefined : field?.inputFlex || 1,
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: field?.inputWidth || 'auto',
                                            }}

                                        >
                                            <div style={{
                                                cursor: 'pointer',
                                                width: '25px',
                                                height: '25px',
                                                border: '1px solid #979797',
                                                background: field.value,
                                            }}
                                                onClick={handleDisplayColorPicker}
                                            />
                                            {
                                                displayColorPicker &&
                                                <div style={{
                                                    position: 'absolute',
                                                    zIndex: '2',
                                                    left: '325px',
                                                }}>
                                                    <div style={{
                                                        position: 'fixed',
                                                        top: '0px',
                                                        right: '0px',
                                                        bottom: '0px',
                                                        left: '250px',
                                                    }}
                                                        onClick={handleCloseColorPicker}
                                                    />
                                                    <SketchPicker
                                                        color={field.value}
                                                        onChange={(color) => handleColorChange(color, index)}
                                                    />
                                                </div>
                                            }
                                            <div className={feedbackClassName}>
                                                {message}
                                            </div>
                                        </div>
                                        {
                                            field.inputWidth
                                                ?
                                                null
                                                :
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: field.inputWidth ? undefined : field?.inputFlex || 0.8,
                                                        flexDirection: 'column',
                                                        marginLeft: 10,
                                                        width: field?.inputWidth || 'auto',
                                                    }}
                                                />
                                        }
                                    </div>
                            )
                        }
                        return null;
                    })
                }
                <input type='submit' style={{ display: 'none' }} />
            </form>
        </div>
    )
});

export default React.forwardRef(Forms);