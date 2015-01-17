package com.lightspeedworks.string;

import java.util.HashMap;
import java.util.Map;

/**
 * StringUtils.
 */
public class StringUtils {
	/**
	 * FILL_STRINGS.
	 */
	static final Map<String, String> FILL_STRINGS = new HashMap<String, String>();

	/**
	 * static initializer.
	 */
	static {
		FILL_STRINGS.put("0", "00000000");
		FILL_STRINGS.put(" ", "        ");
	}

	/**
	 * leftPad.
	 *
	 * @param str
	 *            String
	 * @param width
	 *            int
	 * @return String
	 */
	static public String leftPad(String str, int width) {
		return leftPad(str, width, " ");
	}

	/**
	 * leftPad.
	 *
	 * @param str
	 *            String
	 * @param width
	 *            int
	 * @param fillChar
	 *            char
	 * @return String
	 */
	static public String leftPad(String str, int width, char fillChar) {
		return leftPad(str, width, String.valueOf(fillChar));
	}

	/**
	 * leftPad.
	 *
	 * @param str
	 *            String
	 * @param width
	 *            int
	 * @param fillChar
	 *            String
	 * @return String
	 */
	static public String leftPad(String str, int width, String fillChar) {
		String fillString = FILL_STRINGS.get(fillChar);
		if (fillString == null) {
			fillString = fillChar;
			FILL_STRINGS.put(fillChar, fillString);
		}

		int fillSize = width - str.length();
		if (fillSize <= 0)
			return str;

		while (fillSize > fillString.length()) {
			fillString += fillString;
			FILL_STRINGS.put(fillChar, fillString);
		}

		fillString += str;
		return fillString.substring(fillString.length() - width);
	}


	/**
	 * rightPad.
	 *
	 * @param str
	 *            String
	 * @param width
	 *            int
	 * @return String
	 */
	static public String rightPad(String str, int width) {
		return rightPad(str, width, " ");
	}

	/**
	 * rightPad.
	 *
	 * @param str
	 *            String
	 * @param width
	 *            int
	 * @param fillChar
	 *            char
	 * @return String
	 */
	static public String rightPad(String str, int width, char fillChar) {
		return rightPad(str, width, String.valueOf(fillChar));
	}

	/**
	 * rightPad.
	 *
	 * @param str
	 *            String
	 * @param width
	 *            int
	 * @param fillChar
	 *            String
	 * @return String
	 */
	static public String rightPad(String str, int width, String fillChar) {
		String fillString = FILL_STRINGS.get(fillChar);
		if (fillString == null) {
			fillString = fillChar;
			FILL_STRINGS.put(fillChar, fillString);
		}

		int fillSize = width - str.length();
		if (fillSize <= 0)
			return str;

		while (fillSize > fillString.length()) {
			fillString += fillString;
			FILL_STRINGS.put(fillChar, fillString);
		}

		fillString = str + fillString;
		return fillString.substring(0, width);
	}

}