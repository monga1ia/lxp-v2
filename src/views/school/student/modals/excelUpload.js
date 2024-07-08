import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import { StepsStyleConfig } from 'chakra-ui-steps'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
// import { schoolStudentExcelUpload } from 'utils/url'
import { ReactSpreadsheetImport } from 'react-spreadsheet-import'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MatchIconTheme = {
    baseStyle: props => {
        return {
            ...StepsStyleConfig.baseStyle(props).stepIconContainer,
            borderWidth: '2px',
            bg: 'background',
            borderColor: 'rsi.500',
            color: 'background',
            transitionDuration: 'ultra-fast',
        }
    },
    defaultProps: {
        size: 'md',
        colorScheme: 'rsi',
    },
}

const headingStyle = {
    fontSize: '2xl',
    color: 'rsi.500',
    fontFamily: 'MulishRegular',
}

const titleStyle = {
    fontSize: 'xl',
    color: '#575962',
}

const refFields = [
    {
        key: 'class',
        label: t('group.name'),
        alternateMatches: ['Анги', 'Бүлэг'],
        fieldType: { type: 'select' },
        description: t('sheetImport.required.grade'),
        example: '1Б',
        validations: [
            {
                rule: 'required',
                errorMessage: t('sheetImport.required.grade'),
            },
        ],
    },
    {
        key: 'studentCode',
        label: t('student?.student_code'),
        alternateMatches: ['Сурагчийн код', 'код'],
        fieldType: { type: 'select' },
        description: t('sheetImport.unique.studentCode'),
        example: 'HG746483',
        validations: [
            {
                rule: 'required',
                errorMessage: t('sheetImport.required.studentCode'),
            },
            {
                rule: 'unique',
                errorMessage: t('sheetImport.unique.studentCode'),
            },
        ],
    },
    {
        key: 'username',
        label: t('teacher?.login_name'),
        alternateMatches: ['Нэвтрэх', 'нэр', 'Нэвтрэх нэр', 'Хэрэглэгчийн нэр'],
        fieldType: { type: 'input' },
        description: t('sheetImport.regex.email'),
        example: 'damia@eschool.edu.mn',
        validations: [
            {
                rule: 'required',
                errorMessage: t('sheetImport.required.username'),
            },
            {
                rule: 'unique',
                errorMessage: t('sheetImport.unique.username'),
            },
            {
                rule: 'regex',
                value: emailRegex,
                errorMessage: t('sheetImport.regex.email'),
            },
        ],
    },
    {
        key: 'password',
        label: t('password'),
        alternateMatches: ['Нууц үг', 'нууц', 'үг'],
        fieldType: { type: 'input' },
        description: t('sheetImport.desc.studentPassword'),
        example: 'myPassword',
    },
]

const excelUpload = ({ onClose, onSubmit, open }) => {
    const [loading, setLoading] = useState(false)

    const [fields, setFields] = useState([])
    const [classes, setClasses] = useState([])
    const [studentCodes, setStudentCodes] = useState([])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(schoolStudentExcelUpload, 'POST')
    //         .then((res) => {
    //             if (res.success) {
    //                 const { classes } = res.data
    //                 const studentCodes = []
    //                 classes?.forEach(el =>
    //                     el?.studentCodes?.forEach(code =>
    //                         studentCodes?.push({
    //                             value: code,
    //                             label: code
    //                         })
    //                     )
    //                 )
    //                 refFields.find(el => el.key == 'class').fieldType.options = classes || []
    //                 refFields.find(el => el.key == 'studentCode').fieldType.options = studentCodes || []
    //                 setFields(refFields)
    //                 setClasses(classes || [])
    //                 setStudentCodes(studentCodes || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err?.error_occurred'))
    //             setLoading(false)
    //         })
    // }, [])

    const handleUploadStepHook = data => {
        console.log('handleUplaodStep')
        // if (!data?.length) {
        //     onClose()
        //     message(t('err?.file_empty'))
        // }
        // return data
    }

    const handleMatchColumnsStepHook = (data, rawData, columns) => {
        console.log('handleMatchColumns')
        // const studentCodeIndex = columns?.find(el => el?.value == 'studentCode')?.index
        // const classIndex = columns?.find(el => el?.value == 'class')?.index
        // rawData?.forEach((row, index) => {
        //     const studentCode = row?.[studentCodeIndex]?.toString()?.replace(/\s/g, '')?.toLowerCase()
        //     const studentClass = row?.[classIndex]?.toString()?.replace(/\s/g, '')?.toLowerCase()
        //     data[index].studentCode = studentCodes?.find(el => el?.label?.toLowerCase() == studentCode)?.value
        //     data[index].class = classes?.find(el => el?.label?.toLowerCase() == studentClass)?.value
        // })
        // return data
    }

    const handleRowHook = (row, addError) => {
        console.log('handleRow')
        // Object.keys(row)?.forEach(key => {
        //     const value = row?.[key]?.toString()?.replace(/\s/g, '')
        //     switch (key) {
        //         case 'password':
        //             if (!row[key])
        //                 row[key] = row?.studentCode
        //             break
        //         case 'studentCode':
        //             const studentClass = classes?.find(el => el?.value == row?.class)
        //             if (!studentClass?.studentCodes?.includes(row?.studentCode))
        //                 addError(key, {
        //                     message: `${studentClass?.label} ${t('sheetImport.error.studentNotExists2')}`,
        //                     level: 'error'
        //                 })
        //             break
        //         default:
        //             row[key] = value
        //             break
        //     }
        // })
        // return row
    }

    return (
        // <div>
        //     asdf
        // </div>
        <>
            <ReactSpreadsheetImport
                isOpen={open}
                fields={fields}
                onClose={onClose}
                rowHook={handleRowHook}
                allowInvalidSubmit={false}
                uploadStepHook={handleUploadStepHook}
                matchColumnsStepHook={handleMatchColumnsStepHook}
                translations={{ ...t('sheetImport')}}
                onSubmit={(data) => { onSubmit(JSON.stringify(data?.validData)) }}
                customTheme={{
                    colors: {
                        rsi: {
                            50: '#FFE0D5',
                            100: '#FFD1C0',
                            200: '#FFB497',
                            300: '#FF966F',
                            400: '#FF7946',
                            500: '#FF5B1D',
                            600: '#E43F00',
                            700: '#AC2F00',
                            800: '#742000',
                            900: '#3C1000',
                        },
                        green: {
                            50: '#FFE0D5',
                            100: '#FFD1C0',
                            200: '#FFB497',
                            300: '#FF966F',
                            400: '#FF7946',
                            500: '#FF5B1D',
                            600: '#E43F00',
                            700: '#AC2F00',
                            800: '#742000',
                            900: '#3C1000',
                        }
                    },
                    components: {
                        UploadStep: {
                            baseStyle: {
                                heading: headingStyle,
                                title: titleStyle,
                            },
                        },
                        SelectSheetStep: {
                            baseStyle: {
                                heading: headingStyle,
                            },
                        },
                        SelectHeaderStep: {
                            baseStyle: {
                                heading: headingStyle,
                            },
                        },
                        MatchColumnsStep: {
                            baseStyle: {
                                heading: headingStyle,
                                title: titleStyle,
                            },
                        },
                        ValidationStep: {
                            baseStyle: {
                                heading: headingStyle,
                            },
                        },
                        MatchIcon: MatchIconTheme,
                    },
                }}
            />
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </>
    )
}

export default excelUpload