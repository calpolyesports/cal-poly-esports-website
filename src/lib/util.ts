export function verifyString(value: unknown, minLength: number, maxLength: number): string | null {
    if (typeof value !== "string") {
        return "Invalid value";
    } else if (value.length < minLength || value.length > maxLength) {
        return `Value must be between ${minLength} and ${maxLength} characters`;
    }
    return null;
}

export function verifyDate(value: unknown): string | null {
    if (typeof value !== "string") {
        return "Invalid value";
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }
    return null;
}

export function verifyClubPermissions(clubs: string[], user?: { admin_for: string[] }): string | null {
    for (const club of clubs) {
        if (!user || !user.admin_for.includes(club)) {
            return `Insufficient permissions for club: ${club}`;
        }
    }
    return null;
}
