package com.lightspeedworks.date;

import com.lightspeedworks.string.StringUtils;

/**
 * DateUtils.
 */
public class DateUtils {
	/**
	 * RADIX.
	 */
	static final int RADIX = 36;

	/**
	 * WIDTH.
	 */
	static final int WIDTH = 10;

	/**
	 * ZERO.
	 */
	static final String ZERO = "0";

	/**
	 * valueOf.
	 *
	 * @param time
	 *            long
	 * @return String time
	 */
	static public String valueOf(long time) {
		return StringUtils.leftPad(Long.toString(time, RADIX), WIDTH, ZERO);
	}

	/**
	 * valueOf.
	 *
	 * @param time
	 *            String
	 * @return long time
	 */
	static public long valueOf(String time) {
		return Long.parseLong(time, RADIX);
	}

}
