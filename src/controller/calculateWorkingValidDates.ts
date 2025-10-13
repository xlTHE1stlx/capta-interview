import { Temporal as tp } from "@js-temporal/polyfill";
import { isHoliday } from "./utils";
import { get } from "http";

function getCurrentTimeForAPIClean(): tp.PlainDateTime {
	const currentTime: tp.ZonedDateTime = tp.Now.instant().toZonedDateTimeISO("America/Bogota");
	const isoString: string = currentTime.toString();
	let currentDateTime: tp.PlainDateTime = currentTime.toPlainDateTime();

	const match: RegExpMatchArray | null = isoString.match(
		/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/
	);

	if (match) {
		currentDateTime = tp.PlainDateTime.from(`${match[1]}`);
	}

	return currentDateTime;
}

function parseUserDate(dateString: string): tp.PlainDateTime {
	try {
		if (dateString.endsWith("Z")) {
			const instant = tp.Instant.from(dateString);
			return instant.toZonedDateTimeISO("America/Bogota").toPlainDateTime().add({ hours: 5 });
		}

		if (dateString.includes("T")) {
			const datetime: tp.PlainDateTime = tp.PlainDateTime.from(dateString);
			return datetime;
		}

		return tp.PlainDateTime.from(dateString);
	} catch (error) {
		throw new Error(`Fecha inválida: ${dateString}`);
	}
}

function getMinDateTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 8,
		minute: date.minute,
		second: date.second
	});
}

function getMaxDateTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 17,
		minute: date.minute,
		second: date.second
	});
}

function getLunchStartTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 12,
		minute: 0,
		second: 0
	});
}

function getLunchEndTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 13,
		minute: 0,
		second: 0
	});
}

function compareDates(date1: tp.PlainDateTime, date2: tp.PlainDateTime): number {
	return tp.PlainDateTime.compare(date1, date2);
}

async function addDays(date: tp.PlainDateTime, days: number): Promise<tp.PlainDateTime> {
	for (let i: number = 0; i < days; i++) {
		date = date.add({ days: 1 });
		while (date.dayOfWeek > 5 || (await isHoliday(date.toString()))) {
			date = date.add({ days: 1 });
		}
	}
	return date;
}

async function addHours(date: tp.PlainDateTime, hours: number): Promise<tp.PlainDateTime> {
	console.log("Initial date in addHours:", date.toString());
	console.log("Initial hours in addHours:", hours);
	console.log("Hour of the day:", date.hour, "\n");
	let finalDate: tp.PlainDateTime = date;
	if (
		compareDates(finalDate, getLunchStartTime(finalDate)) >= 0 &&
		compareDates(finalDate, getLunchEndTime(finalDate)) < 0
	) {
		finalDate = getLunchStartTime(finalDate);
	}

	if (
		compareDates(date.add({ hours }), getLunchStartTime(finalDate)) > 0 &&
		compareDates(finalDate, getLunchEndTime(finalDate)) < 0
	) {
		finalDate = await addHours(finalDate, 1);
	}
	finalDate = date.add({ hours });
	let leftTime: number | undefined = undefined;
	if (compareDates(finalDate, getMinDateTime(finalDate)) < 0) {
		leftTime = 8 - finalDate.hour;
		console.log("Left time 8:", leftTime);
		finalDate = getMinDateTime(finalDate);
	}

	if (compareDates(finalDate, getMaxDateTime(finalDate)) > 0) {
		leftTime = finalDate.hour - 17;
		console.log("Left time 17:", leftTime);
		finalDate = await addDays(finalDate, 1);
		finalDate = getMinDateTime(finalDate);
		finalDate = await addHours(finalDate, leftTime);
	}
	console.log("Final date in addHours:", finalDate.toString(), "\n");

	return finalDate;
}

export function calculateWorkingDate(
	startDate: string | undefined,
	days: number,
	hours: number
): Promise<tp.ZonedDateTime | undefined> {
	return new Promise(
		async (resolve: (value: tp.ZonedDateTime | undefined) => void): Promise<void> => {
			let date: tp.ZonedDateTime | tp.PlainDateTime | undefined;
			if (!startDate) {
				date = getCurrentTimeForAPIClean();
			} else {
				date = parseUserDate(startDate);
			}

			if (days > 0) {
				date = await addDays(date, days);
			}
			if (hours > 0) {
				date = await addHours(date, hours);
			}
			date = date.toZonedDateTime("America/Bogota");
			console.log("output: ", date.toString());
			// date.setDate(date.getDate() + days);
			// date.setHours(date.getHours() + hours);
			console.log({ days, hours });
			resolve(date);
			return;
		}
	);
}
