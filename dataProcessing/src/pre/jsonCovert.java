package pre;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import org.json.JSONObject;

public class jsonCovert {
	
	public void jCov( String rdFile, String wrPath ){
		String base = "/Users/Java/workspace/591Processing/yelp_dataset/";
		rdFile = base + rdFile;
		wrPath = base + wrPath;
		int count = 0;
		
		BufferedReader br = null;
		try {
 
			String curLine;
			br = new BufferedReader( new FileReader(rdFile) );
			
			
			File file = new File(wrPath);
			// if file exists, then delete it
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			bw.write("[");
			//read string
			while ( (curLine = br.readLine() ) != null) {
				//partial retrieve
				JSONObject obj = new JSONObject(curLine);
				bw.write( obj.getString("user_id") + "\n");
				
				count++;
			}
			bw.write("]");
			bw.close();
			System.out.println("total: "+count);
			
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
}
