export interface RegisterFromValues {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
}

export interface LoginFromValues {
    username: string;
    password: string;
    remember: boolean;
}

export interface Competition {
    campaignId: number;
    name: string;
    type: string;
    semester: string;
    startDate: string;
    endDate: string;
    description: string;
}
