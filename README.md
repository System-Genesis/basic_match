# Basic Match

Creates a basic object from the given record. The record can come from different sources.
After creating the record, validate the basic object's fields and if a field is invalid, delete it.

The only required condition for a record is to have an identifier: Identity Card, Personal Number or Goal User Id.

## output:

matched record:

```
{
    firstName?: string;
    lastName?: string;
    rank?: string;
    clearance?: string;
    sex?: string;
    personalNumber?: string;
    identityCard?: string;
    dischargeDay?: string;
    akaUnit?: string;
    entityType?: string;
    serviceType?: string;
    mobilePhone?: string[];
    phone?: string[];
    birthDate?: string;
    address?: string;
    mail?: string;
    job?: string;
    hierarchy?: string;
    userID?: string;
    source?: string;
    goalUserId?: string;
    pictures?: picture;
}
```

picture:

```
{
    profile: {
        meta: {
        path: string;
        format: string;
        takenAt: string;
        updatedAt: string;
        };
    };
}
```
