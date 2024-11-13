export interface insightModel {
    category: string,
    description: string,
    icon: string,
    title: string,
    trigger: {
        condition: string,
        type: string,
        value: number
    },
    moreinformation: string;
}