package pre;

import java.io.*;
import org.json.*;


public class scorePre {
	public void getScore( String allFile, String scoreFile) {
		int counter = 0;
		BufferedReader br = null;
		try {
 
			String curLine;
			String nextLine = null;
			br = new BufferedReader( new FileReader(allFile) );
			
			File file = new File(scoreFile);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			curLine = br.readLine();
			nextLine = br.readLine();
			while ( curLine != null ) {
				counter++;
				bw.write( curLine + ":::" );
				if( nextLine.charAt(0) != '(' ){
					System.out.println("ReadError!");
					break;
				}else{
					curLine = br.readLine();
					curLine = curLine.trim();
				}
				
				//find score
				while( Character.isDigit( curLine.charAt(0) ) ){
					if( curLine.charAt(0) == '0'){
						String score1[] = curLine.split(":");
						score1[1] = score1[1].trim();
						String score2[] = score1[1].split("  ");
						double forTest = 0;
						float forTotal = 0;
						
						for(int i=0; i<score2.length; i++){
							forTotal += Float.parseFloat(score2[i]);
						}
						
						forTest = (Float.parseFloat(score2[0]))*(-1)
								+ Float.parseFloat(score2[1])*(-0.5)
								+ Float.parseFloat(score2[3])*0.5
								+ Float.parseFloat(score2[4])*1;
						
						bw.write( String.format("%.6f", forTest/forTotal) +"\n" );
						System.out.println();
					}
					curLine = br.readLine();
					nextLine = br.readLine();
					if( nextLine == null ){
						curLine = nextLine;
						break;// no difference if last or last but 2 line is null
					}else{ //still more records
						if( nextLine.charAt(0) != '('){
							curLine = curLine.trim();
							//still x: continue;
						}else{
							//a new comment
							break;
						}
					}	
				}	
			}
			
			bw.close();
			System.out.println("\nRecords processsed:" + counter);
			
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (br != null)br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	public void getScore2( String allFile, String scoreFile) {
		int counter = 0;
		int stCounter = 0;
		float stScore = 0;
		BufferedReader br = null;
		try {
 
			String curLine;
			br = new BufferedReader( new FileReader(allFile) );
			
			File file = new File(scoreFile);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			//read string
			while ( (curLine = br.readLine())!= null ) {
				String score1[] = curLine.trim().split(":::");
				if( score1[0].length() == 1 ){ 
					//System.out.println( "this:\'" + score1[0] + "\'"); 
					continue;//skip, no use
				}
				
				if( score1[0].equalsIgnoreCase("Yaqing.") ){
					//calculate score
					float reScore = stScore/stCounter;
					bw.write(String.format("%.3f", reScore) + "\n");
					stCounter = 0;
					stScore = 0;
					counter++;
				}else{
					stCounter++;
					stScore += Float.parseFloat(score1[1]);
				}
			}
			
			bw.close();
			System.out.println("\nRecords processsed:" + counter);
			
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (br != null)br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	public void findStr( String file, String word ){
		
		int counter = 0;
		BufferedReader br = null;
		try {
			String curLine;
			br = new BufferedReader( new FileReader(file) );
			//read file
			while ( (curLine = br.readLine() ) != null) {
				
				if( curLine.contains(word) ){
					System.out.println(curLine);
					counter++;
				}
			}
			System.out.println("total occurance: " + counter);
			if( counter == 0 ) System.out.println("No match!");
			
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (br != null)br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}	
	}
	
	public void addPro( String fJson, String fScore, String combFile  ){
		
		String base = "/Users/Dennis/Java/workspace/591Processing";
		fJson = base + fJson;
		fScore = base + fScore;
		combFile = base + combFile;
		BufferedReader brj = null;
		BufferedReader brs = null;
		try{
			
			brj = new BufferedReader( new FileReader(fJson) );
			brs = new BufferedReader( new FileReader(fScore) );
			File file = new File(combFile);
			file.createNewFile();
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			int counter = 0;
			String jLine=null, sLine = null, wLine=null;
			while( (jLine = brj.readLine()) != null && (sLine = brs.readLine()) != null ){
				//System.out.println(jLine);
				System.out.println(sLine);
				JSONObject obj = new JSONObject(jLine);
				float saScore = Float.parseFloat(sLine);
				obj.put( "SA", saScore );
				
			    wLine = obj.toString();
			    bw.write(wLine + "\n");
			    counter++;
			}
			bw.close();
			System.out.println("Total processed: " + counter);
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (brj != null) brj.close();
				if (brs != null) brs.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	public void combRev( String fJson, String fBiz, String combFile  ){
		
		String base = "/Users/Dennis/Java/workspace/591Processing";
		fJson = base + fJson;
		fBiz = base + fBiz;
		combFile = base + combFile;
		BufferedReader brr = null;
		BufferedReader brb = null;
		
		try{
			brr = new BufferedReader( new FileReader(fJson) );
			brb = new BufferedReader( new FileReader(fBiz) );
			File file = new File(combFile);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			int counter = 0;
			int revCounter = 0;
			String rLine=null, bLine = null, wLine=null, cLine=null;
			
			//for check combine
			
			rLine = brr.readLine();
			bLine = brb.readLine();
			while( rLine != null && bLine != null ){
				//biz
				JSONObject obj2 = new JSONObject(bLine);
				//chk
				JSONObject obj = new JSONObject(rLine);
				JSONObject objTmp = new JSONObject();
				String bizId = obj.getString("business_id");
				
				//String 
				if( bizId.equalsIgnoreCase(obj2.getString("business_id")) ){
					
					objTmp = obj.getJSONObject("checkin_info");
					obj2.put("checkin_info", objTmp);
					wLine = obj2.toString();
					bw.write( wLine + "\n");
					revCounter++;
					counter++;
					rLine = brr.readLine();
					bLine = brb.readLine();
				}else{
					counter++;
					System.out.println("No checkin for " + obj2.getString("business_id") );
					obj2.put("nocheckin_info", "");
					wLine = obj2.toString();
					bw.write( wLine + "\n");
					bLine = brb.readLine();
				}
			}
			
			while( bLine != null){
				JSONObject obj2 = new JSONObject(bLine);
				counter++;
				System.out.println("No checkin for " + obj2.getString("business_id") );
				obj2.put("nocheckin_info", "");
				wLine = obj2.toString();
				bw.write( wLine + "\n");
				bLine = brb.readLine();
			}
			System.out.println(revCounter + "checkin records processed.\n");
			
			//end checkin while
			bw.close();
			System.out.println("Total processed: " + counter);
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (brr != null) brr.close();
				if (brb != null) brb.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	public void combRev2( String fJson, String fBiz, String combFile  ){
		
		String base = "/Users/Dennis/Java/workspace/591Processing";
		fJson = base + fJson;
		fBiz = base + fBiz;
		combFile = base + combFile;
		BufferedReader brr = null;
		BufferedReader brb = null;
		
		try{
			brr = new BufferedReader( new FileReader(fJson) );
			brb = new BufferedReader( new FileReader(fBiz) );
			File file = new File(combFile);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			int counter = 0;
			int revCounter = 0;
			String rLine=null, bLine = null, wLine=null ;
			while( (bLine = brb.readLine()) != null ){ //b-f
				JSONObject obj2 = new JSONObject(bLine);
				JSONObject objTmp = new JSONObject();
				String bizId = obj2.getString("business_id");
				while( (rLine = brr.readLine()) != null ){
					JSONObject obj = new JSONObject(rLine);
					if( bizId.equalsIgnoreCase(obj.getString("business_id")) ){
						objTmp.put("business_id", obj.getString("business_id") );
						objTmp.put("user_id", obj.getString("user_id") );
						objTmp.put("stars", obj.getInt("stars") );
						objTmp.put("date", obj.getString("date") );
						objTmp.put("text", obj.getString("text") );
						objTmp.put("SA", obj.getDouble("SA") );
						obj2.append("review", objTmp);
						wLine = obj2.toString();  
						revCounter++;
					}
				}
				System.out.println(revCounter + " reviews for " + bizId );
				
				if(revCounter == 0){
					obj2.append("Review", objTmp);
					wLine = obj2.toString(); 
				}
				
				counter += revCounter;
				System.out.println(counter + "records processed so far.\n");
				revCounter = 0;
			    bw.write( wLine + "\n");
			    brr.close();
			    brr = new BufferedReader( new FileReader(fJson) );
			}
			bw.close();
			System.out.println("Total processed: " + counter);
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (brr != null) brr.close();
				if (brb != null) brb.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}
}
